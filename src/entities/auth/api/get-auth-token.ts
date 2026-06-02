export const getRandomDemoToken = async () => {
  console.log('--- get refresh token')
  await new Promise((resolve) => setTimeout(resolve, 300))
  return `demo-token-${Math.random().toString(36).slice(2, 10)}`
}
