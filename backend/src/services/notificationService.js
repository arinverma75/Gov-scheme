export function generateNotifications(schemes, userProfile) {
  const notifications = [];
  const now = new Date();

  schemes.forEach(scheme => {
    // Deadline approaching
    if (scheme.deadline) {
      const deadline = new Date(scheme.deadline);
      const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
      
      if (daysLeft > 0 && daysLeft <= 30) {
        notifications.push({
          type: 'deadline',
          title: `⏰ Deadline approaching: ${scheme.name}`,
          message: `Only ${daysLeft} days left to apply for ${scheme.name}. Don't miss out!`,
          schemeId: scheme.id,
          priority: daysLeft <= 7 ? 'high' : 'medium',
          createdAt: now.toISOString()
        });
      }
    }

    // New scheme notification
    if (scheme.status === 'Active') {
      const schemeDate = new Date(scheme.updatedAt || scheme.createdAt || now);
      const daysSinceUpdate = Math.ceil((now - schemeDate) / (1000 * 60 * 60 * 24));
      
      if (daysSinceUpdate <= 7) {
        notifications.push({
          type: 'new_scheme',
          title: `🆕 New scheme available: ${scheme.name}`,
          message: `You may be eligible for ${scheme.name}. ${scheme.benefits}`,
          schemeId: scheme.id,
          priority: 'medium',
          createdAt: now.toISOString()
        });
      }
    }
  });

  // General tips
  notifications.push({
    type: 'tip',
    title: '💡 Complete your profile for better recommendations',
    message: 'Adding more details to your profile helps us find more relevant schemes for you.',
    priority: 'low',
    createdAt: now.toISOString()
  });

  return notifications.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
