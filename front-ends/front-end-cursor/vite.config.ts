import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import devRealtimePlugin from './vite-plugin-dev-realtime.js'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

function tryGit(command: string): string {
  try {
    return execSync(`git ${command}`, { cwd: repoRoot, encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

function githubRepositoryFromRemote(remote: string): string {
  const match = remote.match(/github\.com[:/](.+?)(?:\.git)?$/i)
  return match?.[1] ?? remote
}

function buildInfoEnv(): Record<string, string> {
  const remote = tryGit('config --get remote.origin.url')

  return {
    VITE_GITHUB_REPOSITORY:
      process.env.VITE_GITHUB_REPOSITORY ||
      (remote ? githubRepositoryFromRemote(remote) : 'local'),
    VITE_GIT_BRANCH:
      process.env.VITE_GIT_BRANCH || tryGit('rev-parse --abbrev-ref HEAD') || 'unknown',
    VITE_GIT_COMMIT:
      process.env.VITE_GIT_COMMIT || tryGit('rev-parse --short HEAD') || 'unknown',
    VITE_GIT_COMMIT_MESSAGE:
      process.env.VITE_GIT_COMMIT_MESSAGE || tryGit('log -1 --pretty=%s') || 'Not available',
    VITE_BUILD_DATE: process.env.VITE_BUILD_DATE || new Date().toISOString(),
  }
}

const buildInfoDefine = Object.fromEntries(
  Object.entries(buildInfoEnv()).map(([key, value]) => [
    `import.meta.env.${key}`,
    JSON.stringify(value),
  ]),
)

// https://vite.dev/config/
export default defineConfig({
  define: buildInfoDefine,
  plugins: [react(), devRealtimePlugin()],
  server: {
    fs: {
      allow: [repoRoot],
    },
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/realtime': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/realtime/, ''),
      },
      '/wsdc-registry': {
        target: 'https://worldsdc.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(/^\/wsdc-registry/, '/wp-json/wsdcregistry/v1'),
      },
    },
  },
})
