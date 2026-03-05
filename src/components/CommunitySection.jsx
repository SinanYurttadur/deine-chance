import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { templates, usefulLinks } from '../data/communityData';
import {
  MessageCircle,
  Download,
  Link as LinkIcon,
  Hash,
  PlusCircle,
  Send,
  ThumbsUp,
  ExternalLink,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';

// Icon ist jetzt ein Emoji aus der DB - kein Mapping mehr nötig

const CommunitySection = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('forum');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New post form
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Replies
  const [expandedPost, setExpandedPost] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [postReplies, setPostReplies] = useState({});

  // Kategorien laden
  useEffect(() => {
    loadCategories();
  }, []);

  // Posts laden wenn Kategorie sich ändert
  useEffect(() => {
    if (activeCategory) {
      loadPosts();
    }
  }, [activeCategory]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('sort_order');

      if (error) throw error;

      setCategories(data || []);
      if (data && data.length > 0) {
        setActiveCategory(data[0]);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      // Fallback zu statischen Kategorien wenn DB nicht verfügbar
      setCategories([
        { id: '1', name: 'Allgemeine Fragen', slug: 'allgemein', description: 'Alle Fragen rund ums Auswandern', icon: 'HelpCircle', color: 'gray' }
      ]);
      setActiveCategory({ id: '1', name: 'Allgemeine Fragen', slug: 'allgemein', description: 'Alle Fragen rund ums Auswandern', icon: 'HelpCircle', color: 'gray' });
      setError('Forum-Datenbank wird eingerichtet...');
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    if (!activeCategory) return;

    try {
      setLoading(true);

      // Versuche von der View zu laden
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profiles:author_id (
            first_name,
            last_name
          )
        `)
        .eq('category_id', activeCategory.id)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPosts(data || []);
    } catch (err) {
      console.error('Error loading posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadReplies = async (postId) => {
    try {
      const { data, error } = await supabase
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

      if (error) throw error;

      setPostReplies(prev => ({
        ...prev,
        [postId]: data || []
      }));
    } catch (err) {
      console.error('Error loading replies:', err);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !activeCategory) return;

    setIsSubmitting(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Nicht angemeldet');

      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          category_id: activeCategory.id,
          author_id: authUser.id,
          title: newPostTitle,
          content: newPostContent
        })
        .select(`
          *,
          profiles:author_id (
            first_name,
            last_name
          )
        `)
        .single();

      if (error) throw error;

      setPosts(prev => [data, ...prev]);
      setNewPostTitle('');
      setNewPostContent('');
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Fehler beim Erstellen des Beitrags: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReply = async (postId) => {
    if (!replyContent.trim()) return;

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Nicht angemeldet');

      const { data, error } = await supabase
        .from('forum_replies')
        .insert({
          post_id: postId,
          author_id: authUser.id,
          content: replyContent
        })
        .select(`
          *,
          profiles:author_id (
            first_name,
            last_name
          )
        `)
        .single();

      if (error) throw error;

      setPostReplies(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data]
      }));

      // Update reply count in post
      setPosts(prev => prev.map(post =>
        post.id === postId ? { ...post, replies_count: (post.replies_count || 0) + 1 } : post
      ));

      setReplyContent('');
    } catch (err) {
      console.error('Error adding reply:', err);
      alert('Fehler beim Antworten: ' + err.message);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // Optimistic update
      setPosts(prev => prev.map(post =>
        post.id === postId ? { ...post, likes_count: (post.likes_count || 0) + 1 } : post
      ));

      // Check if already liked
      const { data: existing } = await supabase
        .from('forum_likes')
        .select('id')
        .eq('user_id', authUser.id)
        .eq('post_id', postId)
        .single();

      if (existing) {
        // Unlike
        await supabase.from('forum_likes').delete().eq('id', existing.id);
        setPosts(prev => prev.map(post =>
          post.id === postId ? { ...post, likes_count: Math.max(0, (post.likes_count || 0) - 2) } : post
        ));
      } else {
        // Like
        await supabase.from('forum_likes').insert({ user_id: authUser.id, post_id: postId });
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const toggleExpandPost = (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      if (!postReplies[postId]) {
        loadReplies(postId);
      }
    }
  };

  const downloadTemplate = (template) => {
    const blob = new Blob([template.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAuthorInitials = (post) => {
    const firstName = post.profiles?.first_name || '';
    const lastName = post.profiles?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '??';
  };

  const getAuthorName = (post) => {
    const firstName = post.profiles?.first_name || 'Anonym';
    const lastName = post.profiles?.last_name || '';
    return `${firstName} ${lastName.charAt(0)}.`.trim();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Community</h1>
        <p className="text-gray-600 mt-1">Vernetze dich, tausche Erfahrungen aus und erhalte Unterstützung.</p>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {/* Sub-Navigation */}
      <div className="flex gap-2 border-b border-gray-200 pb-4">
        {[
          { id: 'forum', name: 'Forum', icon: MessageCircle },
          { id: 'vorlagen', name: 'Vorlagen & Downloads', icon: Download },
          { id: 'links', name: 'Nützliche Links', icon: LinkIcon }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSubTab === tab.id
                  ? 'bg-swiss-red text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Forum View */}
      {activeSubTab === 'forum' && (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Channels Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4" /> Kanäle
              </h3>
              <div className="space-y-1">
                {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        activeCategory?.id === category.id
                          ? 'bg-swiss-red/10 text-swiss-red font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-base">{category.emoji || '💬'}</span>
                      {category.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* Channel Info */}
            {activeCategory && (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 mt-4 border border-gray-100">
                <h4 className="font-semibold text-gray-900">{activeCategory.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{activeCategory.description}</p>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* New Post Form */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-swiss-red" />
                Neuen Beitrag erstellen
              </h3>
              <input
                type="text"
                placeholder="Titel deines Beitrags..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:border-swiss-red"
              />
              <textarea
                placeholder="Was möchtest du teilen oder fragen?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-swiss-red"
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500">in #{activeCategory?.name}</span>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPostTitle.trim() || !newPostContent.trim() || isSubmitting}
                  className="bg-swiss-red hover:bg-swiss-red-dark disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Veröffentlichen
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <Loader2 className="w-8 h-8 text-swiss-red animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Beiträge werden geladen...</p>
              </div>
            )}

            {/* Posts List */}
            {!loading && posts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Noch keine Beiträge</h3>
                <p className="text-gray-600 text-sm">Sei der/die Erste und starte eine Diskussion!</p>
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-swiss-red/10 rounded-full flex items-center justify-center text-swiss-red font-semibold flex-shrink-0">
                        {getAuthorInitials(post)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{getAuthorName(post)}</span>
                          <span className="text-xs text-gray-400">{formatDate(post.created_at)}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">{post.title}</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>

                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className="flex items-center gap-1 text-gray-500 hover:text-swiss-red transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm">{post.likes_count || 0}</span>
                          </button>
                          <button
                            onClick={() => toggleExpandPost(post.id)}
                            className="flex items-center gap-1 text-gray-500 hover:text-swiss-red transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{post.replies_count || 0} Antworten</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Replies Section */}
                  {expandedPost === post.id && (
                    <div className="bg-gray-50 border-t border-gray-100 p-6">
                      {(postReplies[post.id] || []).map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3 mb-4 last:mb-0">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-semibold flex-shrink-0">
                            {getAuthorInitials(reply)}
                          </div>
                          <div className="flex-1 bg-white rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900 text-sm">{getAuthorName(reply)}</span>
                              <span className="text-xs text-gray-400">{formatDate(reply.created_at)}</span>
                            </div>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        </div>
                      ))}

                      {/* Reply Input */}
                      <div className="flex gap-3 mt-4">
                        <div className="w-8 h-8 bg-swiss-red/10 rounded-full flex items-center justify-center text-swiss-red text-xs font-semibold flex-shrink-0">
                          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </div>
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            placeholder="Antwort schreiben..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post.id)}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-swiss-red"
                          />
                          <button
                            onClick={() => handleAddReply(post.id)}
                            className="bg-swiss-red text-white px-3 py-2 rounded-lg hover:bg-swiss-red-dark transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Templates View */}
      {activeSubTab === 'vorlagen' && (
        <div className="space-y-8">
          {Object.values(templates).map(category => (
            <div key={category.title}>
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">{category.emoji}</span>
                {category.title}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {category.items.map(template => (
                  <div key={template.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-swiss-red/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-swiss-red" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <p className="text-xs text-gray-500">{template.type} • {template.downloads.toLocaleString()} Downloads</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <button
                      onClick={() => downloadTemplate(template)}
                      className="w-full bg-gray-100 hover:bg-swiss-red hover:text-white text-gray-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Herunterladen
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Useful Links View */}
      {activeSubTab === 'links' && (
        <div className="space-y-8">
          {usefulLinks.map(category => (
            <div key={category.category}>
              <h3 className="font-bold text-gray-900 text-lg mb-4">{category.category}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.links.map(link => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md hover:border-swiss-red/30 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-swiss-red/10 rounded-lg flex items-center justify-center group-hover:bg-swiss-red transition-colors">
                        <ExternalLink className="w-4 h-4 text-swiss-red group-hover:text-white transition-colors" />
                      </div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-swiss-red transition-colors">{link.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunitySection;
