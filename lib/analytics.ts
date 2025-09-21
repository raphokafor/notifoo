import { track } from "@vercel/analytics/react";

// Define your event types for better type safety
export type AnalyticsEvent =
  | "reminder_created"
  | "reminder_deleted"
  | "reminder_completed"
  | "reminder_done"
  | "reminder_edited"
  | "dashboard_view_changed"
  | "settings_updated"
  | "notification_settings_changed"
  | "subscription_upgraded"
  | "manage_payment"
  | "user_onboarded"
  | "timer_created"
  | "phone_number_verification_started"
  | "phone_verification_completed";

export interface AnalyticsProperties {
  userId?: string;
  reminderType?: string;
  notificationMethods?: string[];
  viewMode?: string;
  subscriptionTier?: string;
  [key: string]: any;
}

export const trackEvent = (
  event: AnalyticsEvent,
  properties?: AnalyticsProperties
) => {
  // Only track in production or when explicitly enabled
  if (process.env.NODE_ENV !== "production" && !process.env.ENABLE_ANALYTICS) {
    console.log(`[Analytics] ${event}`, properties);
    return;
  }

  try {
    // Convert arrays to strings for Vercel Analytics compatibility
    const processedProperties = properties
      ? {
          ...properties,
          notificationMethods: properties.notificationMethods?.join(","),
        }
      : {};

    track(event, {
      timestamp: new Date().toISOString(),
      ...processedProperties,
    });
  } catch (error) {
    console.error("Analytics tracking failed:", error);
  }
};
