import { FC, useState } from 'react';
import { Video, Tag, Bookmark, Share2, ExternalLink, Eye, ThumbsUp, MessageSquare } from 'lucide-react';

export interface VideoType {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channel: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  publishedAt: string;
  tags: string[];
  embedUrl: string;
}

const FeaturedVideos: FC<{ videos: VideoType[] }> = ({ videos }) => {
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const handleReadMore = (idx: number) => {
    setExpanded(prev => ({ ...prev, [idx]: true }));
  };
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
          <Video className="w-3 h-3 md:w-4 md:h-4 text-white" />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-white">
          Featured Video Picks
        </h3>
      </div>
      <div className="space-y-4 md:space-y-6">
        {videos.slice(0, 3).map((video, idx) => (
          <div
            key={idx}
            className="card-modern p-4 md:p-6 mb-4 md:mb-6"
          >
            <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm md:text-base">
                {idx + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2">
                  {video?.title}
                </h4>
                <p className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">
                  By {video?.channel} •{' '}
                  {video?.views?.toLocaleString()} views
                </p>
                <p className="text-gray-300 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">
                  {video?.description && video.description.length > 200 && !expanded[idx] ? (
                    <>
                      {video.description.substring(0, 200)}{' '}
                      <button
                        className="text-indigo-400 underline ml-1 hover:text-indigo-300 focus:outline-none"
                        onClick={() => handleReadMore(idx)}
                        type="button"
                      >
                        Read more
                      </button>
                    </>
                  ) : (
                    <span className={expanded[idx] ? '' : 'line-clamp-2 md:line-clamp-3'}>
                      {video?.description}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                  {video?.tags
                    ?.slice(0, 4)
                    .map((tag: string, tagIdx: number) => (
                      <span
                        key={tagIdx}
                        className="inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <button className="p-2 rounded-lg glass hover:bg-white/10 transition-colors">
                  <Bookmark className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                </button>
                <button className="p-2 rounded-lg glass hover:bg-white/10 transition-colors">
                  <Share2 className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                </button>
              </div>
            </div>
            {/* YouTube Embed */}
            <div className="relative w-full h-48 sm:h-56 md:aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black group">
              <iframe
                src={video?.embedUrl}
                title={video?.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
              <div className="absolute top-2 md:top-4 right-2 md:right-4 opacity-0 md:group-hover:opacity-100 transition-opacity flex gap-1 md:gap-2">
                <button className="p-2 rounded-lg bg-black/70 backdrop-blur-sm text-white hover:bg-black/90 transition-colors">
                  <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
            {/* Video Stats */}
            <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 md:w-4 md:h-4" />
                  {video?.views?.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3 md:w-4 md:h-4" />
                  {video?.likes?.toLocaleString()}
                </span>
                <span className="flex items-center gap-1 mobile-hidden md:flex">
                  <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
                  {video?.comments?.toLocaleString()}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(video?.publishedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedVideos; 