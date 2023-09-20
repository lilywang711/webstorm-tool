const { execSync } = require('child_process')
const [,,projectDir] = process.argv;

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { cwd: projectDir }).toString().trim()
  } catch (error) {
    console.error('无法获取Git分支信息:', error)
    return 'git分支获取出错'
  }
}

function getTargetBranch(currentBranch) {
  return currentBranch.replace('feature/', 'release/');
}

async function start() {
  const sourceBranch = await getCurrentBranch();
  
  if (!sourceBranch.startsWith('feature/')) {
    console.error('❌本地当前分支应以 feature/ 开头')
    process.exit(1)
  }
  
  const targetBranch = getTargetBranch(sourceBranch);
  execSync(`git fetch . ${sourceBranch}:${targetBranch}`, { cwd: projectDir })
  execSync(`git push origin ${targetBranch}:${targetBranch}`, { cwd: projectDir })
  
  // 可选 看你是否要删除本地分支
  execSync(`git branch --delete ${targetBranch}`, { cwd: projectDir })
  
  console.log(`✅${targetBranch} 分支已推送!`)
  process.exit(0)
}

start();
