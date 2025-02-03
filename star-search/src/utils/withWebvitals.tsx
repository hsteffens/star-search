'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { JSX } from 'react';

export const withWebvitals = (Component: () => JSX.Element, page: string) => {
    const WrappedComponent = () => {
        useReportWebVitals((metric) => {
            switch (metric.name) {
                case 'CLS': //Cumulative Layout Shift - Expected value 0.1 or less
                case 'LCP': //Largest Contentful Paint - Expected value 2.5 seconds or less
                case 'FID': //First Input Delay - Expedted value 100ms or less
                case 'FCP': //First Contentful Paint - Expedted value 1.8s or less
                case 'TTFB': //Time To First Byte - Expedted value 600ms or less
                    console.log(`Page ${page} - Metric ${metric.name}: ${metric.value.toFixed(3)} - Rating ${metric.rating}`)
                    break
                default:
                    break
            }
        })

        return <Component />
    }
    return WrappedComponent;
}