-- Create audit_logs table for QA and security tracking
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  status TEXT CHECK (status IN ('success', 'error')),
  details JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_id (user_id),
  INDEX idx_resource (resource_type, resource_id),
  INDEX idx_created_at (created_at)
);

-- Create activity_logs table for user activity feed
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  link TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- Create notifications table for real-time alerts
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_id (user_id),
  INDEX idx_read (read),
  INDEX idx_created_at (created_at)
);

-- Create email_logs table for tracking emails sent
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  email_type TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  metadata JSONB,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_recipient (recipient_email),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
