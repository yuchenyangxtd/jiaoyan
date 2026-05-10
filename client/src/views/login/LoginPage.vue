<template>
  <div class="login-card">
    <h2 class="login-title">安职教研管理系统</h2>
    <p class="login-subtitle">请输入账号密码登录系统</p>
    <el-form ref="formRef" :model="form" :rules="rules" class="login-form" label-width="0">
      <el-form-item prop="username">
        <el-input
          v-model="form.username"
          placeholder="工号"
          size="large"
          :prefix-icon="User"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="密码"
          size="large"
          show-password
          :prefix-icon="Lock"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="large" class="login-btn" :loading="loading" @click="handleLogin">
          {{ loading ? '登录中...' : '登 录' }}
        </el-button>
      </el-form-item>
    </el-form>
    <p v-if="error" class="login-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '../../stores/user'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const error = ref('')

const form = reactive({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await userStore.login(form.username, form.password)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.message || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 0 40px;
}

.login-title {
  font-size: 26px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 8px;
  text-align: center;
}

.login-subtitle {
  font-size: 14px;
  color: #94A3B8;
  margin-bottom: 36px;
  text-align: center;
}

.login-form :deep(.el-input__wrapper) {
  background: #F1F5F9;
  border: none;
  box-shadow: none;
  border-radius: 10px;
  padding: 4px 16px;
  transition: all 0.2s;
}

.login-form :deep(.el-input__wrapper:hover) {
  background: #E2E8F0;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  background: #fff;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
}

.login-form :deep(.el-input__inner) {
  height: 44px;
  font-size: 15px;
}

.login-form :deep(.el-input__prefix) {
  margin-right: 8px;
}

.login-form :deep(.el-input__prefix-inner) svg {
  color: #94A3B8;
}

.login-btn {
  width: 100%;
  height: 46px;
  font-size: 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563EB, #1D4ED8);
  border: none;
  letter-spacing: 4px;
  margin-top: 4px;
  transition: all 0.2s;
}

.login-btn:hover {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
}

.login-error {
  color: #EF4444;
  text-align: center;
  font-size: 13px;
  margin-top: 16px;
}
</style>
