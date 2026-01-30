import { supabase } from './supabase';

// Kategorien laden
export async function getCategories() {
  const { data, error } = await supabase
    .from('forum_categories')
    .select('*')
    .order('sort_order');

  if (error) throw error;
  return data;
}

// Posts für eine Kategorie laden
export async function getPosts(categorySlug = null, limit = 50) {
  let query = supabase
    .from('forum_posts_with_author')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (categorySlug) {
    query = query.eq('category_slug', categorySlug);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Einzelnen Post laden mit Replies
export async function getPost(postId) {
  const { data: post, error: postError } = await supabase
    .from('forum_posts_with_author')
    .select('*')
    .eq('id', postId)
    .single();

  if (postError) throw postError;

  // Replies laden
  const { data: replies, error: repliesError } = await supabase
    .from('forum_replies')
    .select(`
      *,
      profiles:author_id (
        first_name,
        last_name
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (repliesError) throw repliesError;

  return { ...post, replies };
}

// Neuen Post erstellen
export async function createPost({ categoryId, title, content }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht angemeldet');

  const { data, error } = await supabase
    .from('forum_posts')
    .insert({
      category_id: categoryId,
      author_id: user.id,
      title,
      content
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Reply erstellen
export async function createReply({ postId, content }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht angemeldet');

  const { data, error } = await supabase
    .from('forum_replies')
    .insert({
      post_id: postId,
      author_id: user.id,
      content
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Post liken/unliken
export async function togglePostLike(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht angemeldet');

  // Prüfen ob bereits geliked
  const { data: existing } = await supabase
    .from('forum_likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single();

  if (existing) {
    // Unlike
    await supabase
      .from('forum_likes')
      .delete()
      .eq('id', existing.id);

    await supabase
      .from('forum_posts')
      .update({ likes_count: supabase.rpc('decrement', { x: 1 }) })
      .eq('id', postId);

    return false;
  } else {
    // Like
    await supabase
      .from('forum_likes')
      .insert({ user_id: user.id, post_id: postId });

    await supabase
      .from('forum_posts')
      .update({ likes_count: supabase.rpc('increment', { x: 1 }) })
      .eq('id', postId);

    return true;
  }
}

// Prüfen ob User Post geliked hat
export async function hasLikedPost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('forum_likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single();

  return !!data;
}

// Post löschen
export async function deletePost(postId) {
  const { error } = await supabase
    .from('forum_posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
}

// Reply löschen
export async function deleteReply(replyId) {
  const { error } = await supabase
    .from('forum_replies')
    .delete()
    .eq('id', replyId);

  if (error) throw error;
}

// User Progress tracken
export async function trackProgress(itemType, itemId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: user.id,
      item_type: itemType,
      item_id: itemId
    }, {
      onConflict: 'user_id,item_type,item_id'
    });

  if (error) console.error('Progress tracking error:', error);
}

// User Progress laden
export async function getProgress() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { chapters: [], videos: [], templates: [] };

  const { data, error } = await supabase
    .from('user_progress')
    .select('item_type, item_id, completed_at')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error loading progress:', error);
    return { chapters: [], videos: [], templates: [] };
  }

  return {
    chapters: data.filter(p => p.item_type === 'chapter').map(p => p.item_id),
    videos: data.filter(p => p.item_type === 'video').map(p => p.item_id),
    templates: data.filter(p => p.item_type === 'template').map(p => p.item_id)
  };
}

// Progress Statistiken
export async function getProgressStats() {
  const progress = await getProgress();
  return {
    chaptersCompleted: progress.chapters.length,
    videosWatched: progress.videos.length,
    templatesDownloaded: progress.templates.length
  };
}
