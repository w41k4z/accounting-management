CREATE OR REPLACE VIEW general_ledger AS
    SELECT
        'id' AS id, -- These are juste some dummy column to make the view compatible with the targeted table
        'general_account' AS general_account,
        'third_party_account' AS third_party_account,
        'entitled' AS entitled,
        society_id,
        journal_date,
        piece_number,
        part_reference,
        label,
        SUM(debit) AS debit,
        SUM(credit) AS credit
        FROM journal
        GROUP BY 
            society_id,
            journal_date, 
            piece_number, 
            part_reference, 
            label
        ORDER BY
            journal_date;
