-- 中职教研系统 - 数据库初始化
-- 在 Supabase SQL Editor 中运行此脚本

-- 1. 用户扩展表（关联 auth.users）
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  real_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'teacher' CHECK (role IN ('teacher', 'group_leader', 'admin', 'leader')),
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 教研计划表
CREATE TABLE public.plans (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  semester TEXT NOT NULL,
  department TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 教研活动表
CREATE TABLE public.activities (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  location TEXT,
  type TEXT,
  status TEXT DEFAULT 'pending',
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 材料提交表
CREATE TABLE public.materials (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  comment TEXT,
  submitter_id UUID REFERENCES public.users(id) NOT NULL,
  reviewer_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. 通知公告表
CREATE TABLE public.notices (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  is_pinned BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. 启用行级安全（RLS）
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- 7. RLS 策略：用户表
CREATE POLICY "users_select" ON public.users
  FOR SELECT USING (true);  -- 所有登录用户可查看用户列表

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (id = auth.uid());  -- 只能修改自己的信息

-- 8. RLS 策略：教研计划
CREATE POLICY "plans_select" ON public.plans
  FOR SELECT USING (true);

CREATE POLICY "plans_insert" ON public.plans
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'group_leader', 'admin'))
  );

CREATE POLICY "plans_update" ON public.plans
  FOR UPDATE USING (
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('group_leader', 'admin'))
  );

CREATE POLICY "plans_delete" ON public.plans
  FOR DELETE USING (
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin'))
  );

-- 9. RLS 策略：教研活动
CREATE POLICY "activities_select" ON public.activities
  FOR SELECT USING (true);

CREATE POLICY "activities_insert" ON public.activities
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'group_leader', 'admin'))
  );

CREATE POLICY "activities_update" ON public.activities
  FOR UPDATE USING (
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('group_leader', 'admin'))
  );

CREATE POLICY "activities_delete" ON public.activities
  FOR DELETE USING (
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin'))
  );

-- 10. RLS 策略：材料提交
CREATE POLICY "materials_select" ON public.materials
  FOR SELECT USING (
    submitter_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('group_leader', 'admin', 'leader'))
  );

CREATE POLICY "materials_insert" ON public.materials
  FOR INSERT WITH CHECK (submitter_id = auth.uid());

CREATE POLICY "materials_update" ON public.materials
  FOR UPDATE USING (
    submitter_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('group_leader', 'admin'))
  );

-- 11. RLS 策略：通知公告
CREATE POLICY "notices_select" ON public.notices
  FOR SELECT USING (true);

CREATE POLICY "notices_insert" ON public.notices
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'leader'))
  );

CREATE POLICY "notices_delete" ON public.notices
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin'))
  );
