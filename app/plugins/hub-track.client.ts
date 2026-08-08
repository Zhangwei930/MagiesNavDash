export default defineNuxtPlugin(() => {
  const router = useRouter()
  const { trackPageView } = useHubTrack()

  // Initial page
  trackPageView(router.currentRoute.value.path)

  router.afterEach((to) => {
    trackPageView(to.path)
  })
})
