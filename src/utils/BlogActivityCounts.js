const getActivityCounts = (activities, userId) => {
    const likes = activities.filter(activity => activity.activityType === 'LIKE').length;
    const bookmarks = activities.filter(activity => activity.activityType === 'BOOKMARK').length;
    const liked = activities.some(activity => activity.activityType === 'LIKE' && activity.userId === userId);
    const bookmarked = activities.some(activity => activity.activityType === 'BOOKMARK' && activity.userId === userId);
  
    return { likes, bookmarks, liked, bookmarked };
};
export default getActivityCounts;
  