ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_leads_counselor_or_admin"
ON leads FOR SELECT USING (
  (auth.jwt() ->> 'role' = 'admin')
  OR owner_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM user_teams ut
    WHERE ut.user_id = auth.uid()
    AND ut.team_id = leads.team_id
  )
);

CREATE POLICY "insert_leads_counselor_or_admin"
ON leads FOR INSERT WITH CHECK (
  (auth.jwt() ->> 'role' = 'admin')
  OR (
    auth.jwt() ->> 'role' = 'counselor'
    AND (
      owner_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM user_teams ut
        WHERE ut.user_id = auth.uid()
        AND ut.team_id = leads.team_id
      )
    )
  )
);
