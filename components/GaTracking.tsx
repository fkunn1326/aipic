import { useRouter } from "next/router"
import Script from "next/script"
import React, { useEffect } from "react"

export const GATracking = ({trackingId}) => {
    const router = useRouter()
    const { events } = router || {}
    useEffect(() => {
      const handleRouteChange = (url: string) => {
        if (!window) return
        window.gtag('config', '${trackingId}', {
          page_path: url,
        });
      }
      events.on('routeChangeComplete', handleRouteChange)
      events.on('hashChangeComplete', handleRouteChange)
      return () => {
        events.off('routeChangeComplete', handleRouteChange)
        events.off('hashChangeComplete', handleRouteChange)
      }
    }, [events])
    return (
      <>
        <Script
          async
          strategy='lazyOnload'
          id="gtag"
          src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
        />
        <Script strategy='afterInteractive' id="myscript">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackingId}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </>
    )
  }