ALTER TABLE platform_users ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free';

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  method text NOT NULL CHECK (method IN ('stripe', 'manual', 'admin_override')),
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  transaction_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status_method ON transactions(status, method);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
