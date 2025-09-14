import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  FileImage, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Trash2
} from 'lucide-react'
import s3Service from '../services/s3Service'

const ImageUpload = ({
  onUploadComplete,
  onUploadError,
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  uploadPrefix = 'uploads',
  showPreview = true,
  multiple = true,
  className = ''
}) => {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [errors, setErrors] = useState([])
  const [uploadedImages, setUploadedImages] = useState([])
  const fileInputRef = useRef(null)

  // Handle file selection
  const handleFileSelect = useCallback((selectedFiles) => {
    const fileArray = Array.from(selectedFiles)
    const validFiles = []
    const newErrors = []

    // Validate each file
    fileArray.forEach((file, index) => {
      const validation = s3Service.validateFile(file, {
        maxSize: maxFileSize,
        allowedTypes
      })

      if (validation.isValid) {
        validFiles.push({
          id: Date.now() + index,
          file,
          preview: URL.createObjectURL(file),
          status: 'pending'
        })
      } else {
        newErrors.push(`${file.name}: ${validation.errors.join(', ')}`)
      }
    })

    // Check total file count
    if (files.length + validFiles.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} files allowed`)
      return
    }

    setFiles(prev => [...prev, ...validFiles])
    setErrors(newErrors)
  }, [files.length, maxFiles, maxFileSize, allowedTypes])

  // Handle drag and drop
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const droppedFiles = e.dataTransfer.files
    handleFileSelect(droppedFiles)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  // Remove file from list
  const removeFile = useCallback((fileId) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId)
      // Revoke object URL to prevent memory leaks
      const fileToRemove = prev.find(f => f.id === fileId)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return updated
    })
  }, [])

  // Upload files to S3
  const uploadFiles = useCallback(async () => {
    if (files.length === 0) return

    setUploading(true)
    setErrors([])
    const uploadResults = []

    try {
      for (const fileItem of files) {
        if (fileItem.status === 'uploaded') continue

        // Update file status
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id 
            ? { ...f, status: 'uploading' }
            : f
        ))

        // Simulate progress (in real implementation, you'd track actual progress)
        setUploadProgress(prev => ({ ...prev, [fileItem.id]: 0 }))
        
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [fileItem.id]: Math.min((prev[fileItem.id] || 0) + 10, 90)
          }))
        }, 200)

        try {
          const result = await s3Service.uploadFile(fileItem.file, {
            prefix: uploadPrefix,
            metadata: {
              uploadedBy: 'user',
              originalSize: fileItem.file.size.toString()
            }
          })

          clearInterval(progressInterval)
          setUploadProgress(prev => ({ ...prev, [fileItem.id]: 100 }))

          if (result.success) {
            // Update file status
            setFiles(prev => prev.map(f => 
              f.id === fileItem.id 
                ? { ...f, status: 'uploaded', uploadResult: result }
                : f
            ))

            uploadResults.push(result)
            setUploadedImages(prev => [...prev, result])
          } else {
            throw new Error(result.error)
          }
        } catch (error) {
          clearInterval(progressInterval)
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id 
              ? { ...f, status: 'error', error: error.message }
              : f
          ))
          setErrors(prev => [...prev, `${fileItem.file.name}: ${error.message}`])
        }
      }

      if (uploadResults.length > 0 && onUploadComplete) {
        onUploadComplete(uploadResults)
      }
    } catch (error) {
      console.error('Upload error:', error)
      if (onUploadError) {
        onUploadError(error)
      }
    } finally {
      setUploading(false)
    }
  }, [files, uploadPrefix, onUploadComplete, onUploadError])

  // Clear all files
  const clearFiles = useCallback(() => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
    setUploadProgress({})
    setErrors([])
  }, [files])

  // Delete uploaded image
  const deleteUploadedImage = useCallback(async (imageResult) => {
    try {
      const result = await s3Service.deleteFile(imageResult.fileName)
      if (result.success) {
        setUploadedImages(prev => prev.filter(img => img.fileName !== imageResult.fileName))
        setFiles(prev => prev.filter(f => f.uploadResult?.fileName !== imageResult.fileName))
      }
    } catch (error) {
      console.error('Delete error:', error)
      setErrors(prev => [...prev, `Failed to delete ${imageResult.fileName}`])
    }
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'uploaded':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileImage className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Images
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your images here, or click to browse
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
              <Badge variant="outline">Max {maxFiles} files</Badge>
              <Badge variant="outline">Max {Math.round(maxFileSize / (1024 * 1024))}MB each</Badge>
              <Badge variant="outline">{allowedTypes.map(type => type.split('/')[1]).join(', ')}</Badge>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={allowedTypes.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Selected Files ({files.length})</h4>
              <div className="space-x-2">
                <Button
                  onClick={uploadFiles}
                  disabled={uploading || files.every(f => f.status === 'uploaded')}
                  size="sm"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload All
                    </>
                  )}
                </Button>
                <Button
                  onClick={clearFiles}
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                >
                  Clear All
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {files.map((fileItem) => (
                <div key={fileItem.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  {/* Preview */}
                  {showPreview && fileItem.preview && (
                    <div className="flex-shrink-0">
                      <img
                        src={fileItem.preview}
                        alt={fileItem.file.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </div>
                  )}

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(fileItem.status)}
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileItem.file.name}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {(fileItem.file.size / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                    
                    {fileItem.status === 'uploading' && (
                      <Progress 
                        value={uploadProgress[fileItem.id] || 0} 
                        className="mt-2 h-2"
                      />
                    )}
                    
                    {fileItem.status === 'error' && (
                      <p className="text-xs text-red-600 mt-1">{fileItem.error}</p>
                    )}
                    
                    {fileItem.status === 'uploaded' && fileItem.uploadResult && (
                      <p className="text-xs text-green-600 mt-1">
                        Uploaded successfully
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    {fileItem.status === 'uploaded' && fileItem.uploadResult && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(fileItem.uploadResult.url, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (fileItem.status === 'uploaded' && fileItem.uploadResult) {
                          deleteUploadedImage(fileItem.uploadResult)
                        } else {
                          removeFile(fileItem.id)
                        }
                      }}
                      disabled={uploading && fileItem.status === 'uploading'}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Images Gallery */}
      {uploadedImages.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-4">Uploaded Images ({uploadedImages.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={image.fileName} className="relative group">
                  <img
                    src={image.url}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(image.url, '_blank')}
                      className="text-white hover:text-gray-300"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteUploadedImage(image)}
                      className="text-white hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ImageUpload

