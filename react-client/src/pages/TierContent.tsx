import { useParams, useNavigate } from 'react-router-dom'
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit'
import { ArrowLeft, Download, Lock, Unlock, Loader2, FileText, Image as ImageIcon, Film, Music, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import { useTier } from '../hooks/useMarketplace'
import { useUserSubscriptions } from '../hooks/useUserSubscriptions'
import { WalrusService } from '../services/walrus.service'
import { SealService } from '../services/seal.service'

// Helper function to get file extension from MIME type
function getFileExtension(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    // Images
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',

    // Videos
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/ogg': 'ogv',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',

    // Audio
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg',
    'audio/webm': 'weba',
    'audio/aac': 'aac',

    // Documents
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',

    // Text
    'text/plain': 'txt',
    'text/html': 'html',
    'text/css': 'css',
    'text/javascript': 'js',
    'application/json': 'json',

    // Archives
    'application/zip': 'zip',
    'application/x-rar-compressed': 'rar',
    'application/x-7z-compressed': '7z',
  }

  return mimeToExt[mimeType] || 'bin'
}

interface ContentItem {
  id: string
  title: string
  description: string
  walrusBlobId: string
  sealPolicyId: string
  contentType: string
  sizeBytes: number
  createdAt: number
}

export default function TierContent() {
  const { tierId } = useParams<{ tierId: string }>()
  const navigate = useNavigate()
  const currentAccount = useCurrentAccount()
  const client = useSuiClient()

  const { data: tier } = useTier(tierId)
  const { data: subscriptions = [] } = useUserSubscriptions()

  const [contents, setContents] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [decryptingId, setDecryptingId] = useState<string | null>(null)
  const [viewingContent, setViewingContent] = useState<{ url: string; type: string; title: string } | null>(null)

  // Check if user has access (is creator or has active subscription)
  const hasAccess = tier && (
    tier.creator === currentAccount?.address ||
    subscriptions.some(sub => sub.tierId === tierId && !sub.isExpired)
  )

  // Fetch content for this tier
  useEffect(() => {
    if (!tierId || !tier) return

    const fetchContent = async () => {
      setLoading(true)
      try {
        const packageId = import.meta.env.VITE_MARKETPLACE_PACKAGE_ID

        // Fetch all Content objects
        // Note: This is a simplified approach. In production, you'd have better indexing
        const objects = await client.multiGetObjects({
          ids: tier.contentIds,
          options: { showContent: true }
        })

        const contentItems: ContentItem[] = []

        for (const obj of objects) {
          if (obj.data?.content && obj.data.content.dataType === 'moveObject') {
            const f = obj.data.content.fields as Record<string, unknown>

            contentItems.push({
              id: obj.data.objectId,
              title: String(f.title || ''),
              description: String(f.description || ''),
              walrusBlobId: String(f.walrus_blob_id || ''),
              sealPolicyId: String(f.seal_policy_id || ''),
              contentType: String(f.content_type || ''),
              sizeBytes: Number(f.size_bytes || 0),
              createdAt: Number(f.created_at || Date.now())
            })
          }
        }

        setContents(contentItems)
      } catch (error) {
        console.error('Error fetching tier content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [tierId, tier, client])

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewingContent) {
        URL.revokeObjectURL(viewingContent.url)
        setViewingContent(null)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [viewingContent])

  // Decrypt content and return blob URL
  const decryptContent = async (content: ContentItem): Promise<{ url: string; blob: Blob }> => {
    const walrus = new WalrusService()
    const seal = new SealService()

    // Download encrypted content from Walrus
    console.log('Downloading encrypted content...')
    const encryptedBlob = await walrus.download(content.walrusBlobId)

    // Decrypt with Seal
    console.log('Decrypting content...')
    const decryptedBlob = await seal.decrypt(encryptedBlob, content.sealPolicyId)

    // Create blob with correct MIME type
    const typedBlob = new Blob([decryptedBlob], { type: content.contentType })
    const url = URL.createObjectURL(typedBlob)

    return { url, blob: typedBlob }
  }

  // View content online (in modal/new tab)
  const handleViewContent = async (content: ContentItem) => {
    if (!hasAccess) {
      alert('You need an active subscription to view this content')
      return
    }

    setDecryptingId(content.id)

    try {
      const { url } = await decryptContent(content)

      // Check if content type is viewable in browser
      const isViewable = content.contentType.startsWith('image/') ||
                        content.contentType.startsWith('video/') ||
                        content.contentType.startsWith('audio/') ||
                        content.contentType === 'application/pdf'

      if (isViewable) {
        // Open in modal for images/videos
        if (content.contentType.startsWith('image/') || content.contentType.startsWith('video/')) {
          setViewingContent({ url, type: content.contentType, title: content.title })
        } else {
          // Open PDFs and audio in new tab
          window.open(url, '_blank')
        }
      } else {
        // For non-viewable types, trigger download
        await handleDownloadContent(content)
      }

      console.log('Content decrypted and ready for viewing!', {
        title: content.title,
        type: content.contentType
      })
    } catch (error) {
      console.error('Error viewing content:', error)
      alert(`Failed to decrypt content: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setDecryptingId(null)
    }
  }

  // Download content
  const handleDownloadContent = async (content: ContentItem) => {
    if (!hasAccess) {
      alert('You need an active subscription to view this content')
      return
    }

    setDecryptingId(content.id)

    try {
      const { url, blob } = await decryptContent(content)

      // Get file extension from content type
      const extension = getFileExtension(content.contentType)
      const filename = content.title.includes('.')
        ? content.title
        : `${content.title}.${extension}`

      // Create a download link
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      console.log('Content downloaded successfully!', {
        filename,
        type: content.contentType
      })
    } catch (error) {
      console.error('Error downloading content:', error)
      alert(`Failed to download content: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setDecryptingId(null)
    }
  }

  if (!tier) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-6 py-8 text-center">
          <Loader2 className="size-8 animate-spin text-brand-600 mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white border-brutal shadow-brutal-lg p-6 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-4 hover-brutal transition-all px-3 py-1 border-brutal-sm"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                {tier.name}
              </h1>
              <p className="text-sm text-gray-600 font-medium mb-4">{tier.description}</p>
              <div className="flex items-center gap-2">
                {hasAccess ? (
                  <div className="flex items-center gap-2 bg-green-400 border-brutal-sm px-3 py-1">
                    <Unlock className="size-4" />
                    <span className="text-xs font-black uppercase">Access Granted</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-red-400 border-brutal-sm px-3 py-1">
                    <Lock className="size-4" />
                    <span className="text-xs font-black uppercase">No Access</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-4 uppercase">Content Library</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-brand-600" />
            </div>
          ) : !hasAccess ? (
            <div className="bg-white border-brutal shadow-brutal p-8 text-center">
              <Lock className="size-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-4">
                You need an active subscription to view this content.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-brand-600 text-white px-6 py-3 border-brutal-sm shadow-brutal-sm hover-brutal font-black uppercase text-sm"
              >
                Browse Marketplace
              </button>
            </div>
          ) : contents.length === 0 ? (
            <div className="bg-white border-brutal shadow-brutal p-8 text-center">
              <p className="text-gray-600 font-medium">No content available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map(content => (
                <ContentCard
                  key={content.id}
                  content={content}
                  onView={() => handleViewContent(content)}
                  onDownload={() => handleDownloadContent(content)}
                  isDecrypting={decryptingId === content.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Content Viewer Modal */}
      {viewingContent && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
          onClick={() => {
            URL.revokeObjectURL(viewingContent.url)
            setViewingContent(null)
          }}
        >
          <div className="relative max-w-7xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                URL.revokeObjectURL(viewingContent.url)
                setViewingContent(null)
              }}
              className="absolute -top-12 right-0 text-white bg-black/50 border-2 border-white px-4 py-2 font-black uppercase text-sm hover:bg-white hover:text-black transition-colors"
            >
              Close
            </button>
            <div className="bg-white border-4 border-white p-2">
              <p className="text-center font-black text-gray-900 mb-2 uppercase text-sm">{viewingContent.title}</p>
              {viewingContent.type.startsWith('image/') ? (
                <img
                  src={viewingContent.url}
                  alt={viewingContent.title}
                  className="max-w-full max-h-[80vh] mx-auto"
                />
              ) : viewingContent.type.startsWith('video/') ? (
                <video
                  src={viewingContent.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] mx-auto"
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ContentCard({ content, onView, onDownload, isDecrypting }: {
  content: ContentItem
  onView: () => void
  onDownload: () => void
  isDecrypting: boolean
}) {
  const sizeInMB = (content.sizeBytes / (1024 * 1024)).toFixed(2)
  const createdDate = new Date(content.createdAt).toLocaleDateString()

  const getContentIcon = () => {
    if (content.contentType.startsWith('image/')) return <ImageIcon className="size-6" />
    if (content.contentType.startsWith('video/')) return <Film className="size-6" />
    if (content.contentType.startsWith('audio/')) return <Music className="size-6" />
    return <FileText className="size-6" />
  }

  return (
    <div className="bg-white border-brutal shadow-brutal p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-blue-400 border-brutal-sm p-2 shadow-brutal-sm">
          {getContentIcon()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-gray-900 uppercase mb-1">{content.title}</h3>
          <p className="text-xs text-gray-600 font-medium">{content.description}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Type:</span>
          <span className="font-black text-gray-900 uppercase">.{getFileExtension(content.contentType)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Format:</span>
          <span className="font-black text-gray-900 text-[10px]">{content.contentType}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Size:</span>
          <span className="font-black text-gray-900">{sizeInMB} MB</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Created:</span>
          <span className="font-black text-gray-900">{createdDate}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onView}
          disabled={isDecrypting}
          className="flex-1 bg-brand-600 text-white px-4 py-2 border-brutal-sm shadow-brutal-sm hover-brutal font-black uppercase text-sm flex items-center justify-center gap-2"
        >
          {isDecrypting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Eye className="size-4" />
              View
            </>
          )}
        </button>
        <button
          onClick={onDownload}
          disabled={isDecrypting}
          className="bg-green-400 text-gray-900 px-3 py-2 border-brutal-sm shadow-brutal-sm hover-brutal font-black"
          title="Download"
        >
          <Download className="size-4" />
        </button>
      </div>
    </div>
  )
}
