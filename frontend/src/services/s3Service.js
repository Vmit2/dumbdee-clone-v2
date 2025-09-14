import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// AWS S3 Configuration
const S3_CONFIG = {
  region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || ''
  }
}

const BUCKET_NAME = process.env.REACT_APP_S3_BUCKET_NAME || 'dumbdee-images'
const CDN_URL = process.env.REACT_APP_CDN_URL || `https://${BUCKET_NAME}.s3.amazonaws.com`

// Initialize S3 Client
const s3Client = new S3Client(S3_CONFIG)

class S3Service {
  constructor() {
    this.client = s3Client
    this.bucketName = BUCKET_NAME
    this.cdnUrl = CDN_URL
  }

  // Generate unique filename
  generateFileName(originalName, prefix = '') {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split('.').pop()
    const cleanName = originalName.replace(/[^a-zA-Z0-9.]/g, '_')
    
    return `${prefix}${prefix ? '/' : ''}${timestamp}_${randomString}_${cleanName}`
  }

  // Upload file to S3
  async uploadFile(file, options = {}) {
    try {
      const {
        prefix = 'uploads',
        acl = 'public-read',
        contentType = file.type,
        metadata = {}
      } = options

      const fileName = this.generateFileName(file.name, prefix)
      
      // Convert file to buffer if it's a File object
      let fileBuffer
      if (file instanceof File) {
        fileBuffer = await file.arrayBuffer()
      } else {
        fileBuffer = file
      }

      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
        ACL: acl,
        Metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
          ...metadata
        }
      }

      const command = new PutObjectCommand(uploadParams)
      const result = await this.client.send(command)

      return {
        success: true,
        fileName,
        url: `${this.cdnUrl}/${fileName}`,
        key: fileName,
        etag: result.ETag,
        location: result.Location
      }
    } catch (error) {
      console.error('S3 Upload Error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files, options = {}) {
    const uploadPromises = files.map(file => this.uploadFile(file, options))
    const results = await Promise.allSettled(uploadPromises)
    
    return results.map((result, index) => ({
      file: files[index].name,
      ...result.value
    }))
  }

  // Delete file from S3
  async deleteFile(fileName) {
    try {
      const deleteParams = {
        Bucket: this.bucketName,
        Key: fileName
      }

      const command = new DeleteObjectCommand(deleteParams)
      await this.client.send(command)

      return {
        success: true,
        message: 'File deleted successfully'
      }
    } catch (error) {
      console.error('S3 Delete Error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get signed URL for private files
  async getSignedUrl(fileName, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileName
      })

      const signedUrl = await getSignedUrl(this.client, command, { expiresIn })
      
      return {
        success: true,
        url: signedUrl
      }
    } catch (error) {
      console.error('S3 Signed URL Error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get presigned URL for direct upload
  async getPresignedUploadUrl(fileName, contentType, expiresIn = 3600) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        ContentType: contentType
      })

      const signedUrl = await getSignedUrl(this.client, command, { expiresIn })
      
      return {
        success: true,
        uploadUrl: signedUrl,
        fileName,
        publicUrl: `${this.cdnUrl}/${fileName}`
      }
    } catch (error) {
      console.error('S3 Presigned URL Error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Upload product images with optimization
  async uploadProductImages(images, productId) {
    const optimizedImages = []
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      
      // Create different sizes for responsive images
      const sizes = [
        { suffix: '_thumb', maxWidth: 150, quality: 0.8 },
        { suffix: '_medium', maxWidth: 500, quality: 0.85 },
        { suffix: '_large', maxWidth: 1200, quality: 0.9 }
      ]

      const imageResults = []
      
      for (const size of sizes) {
        try {
          // In a real implementation, you would resize the image here
          // For now, we'll upload the original image with different names
          const fileName = this.generateFileName(
            `${image.name}${size.suffix}`,
            `products/${productId}`
          )
          
          const result = await this.uploadFile(image, {
            prefix: `products/${productId}`,
            metadata: {
              productId,
              imageIndex: i.toString(),
              size: size.suffix,
              maxWidth: size.maxWidth.toString()
            }
          })
          
          if (result.success) {
            imageResults.push({
              size: size.suffix,
              url: result.url,
              fileName: result.fileName
            })
          }
        } catch (error) {
          console.error(`Error uploading ${size.suffix} image:`, error)
        }
      }
      
      optimizedImages.push({
        original: image.name,
        variants: imageResults
      })
    }
    
    return optimizedImages
  }

  // Upload seller profile images
  async uploadSellerImages(images, sellerId) {
    const results = []
    
    for (const image of images) {
      const result = await this.uploadFile(image, {
        prefix: `sellers/${sellerId}`,
        metadata: {
          sellerId,
          type: 'profile'
        }
      })
      
      if (result.success) {
        results.push(result)
      }
    }
    
    return results
  }

  // Upload category images
  async uploadCategoryImages(images, categoryId) {
    const results = []
    
    for (const image of images) {
      const result = await this.uploadFile(image, {
        prefix: `categories/${categoryId}`,
        metadata: {
          categoryId,
          type: 'category'
        }
      })
      
      if (result.success) {
        results.push(result)
      }
    }
    
    return results
  }

  // Get optimized image URL
  getOptimizedImageUrl(baseUrl, options = {}) {
    const {
      width,
      height,
      quality = 85,
      format = 'webp'
    } = options

    // If using a CDN like CloudFront with image optimization
    if (this.cdnUrl.includes('cloudfront')) {
      const params = new URLSearchParams()
      if (width) params.append('w', width)
      if (height) params.append('h', height)
      if (quality) params.append('q', quality)
      if (format) params.append('f', format)
      
      return `${baseUrl}?${params.toString()}`
    }
    
    // Return original URL if no optimization available
    return baseUrl
  }

  // Validate file before upload
  validateFile(file, options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    } = options

    const errors = []

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`)
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop().toLowerCase()
    if (!allowedExtensions.includes(extension)) {
      errors.push(`File extension ${extension} is not allowed`)
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Get file info
  getFileInfo(url) {
    if (!url || !url.includes(this.cdnUrl)) {
      return null
    }

    const fileName = url.replace(`${this.cdnUrl}/`, '')
    const parts = fileName.split('/')
    
    return {
      fileName,
      folder: parts.length > 1 ? parts[0] : null,
      fullPath: fileName,
      publicUrl: url
    }
  }

  // Clean up old files (utility function)
  async cleanupOldFiles(prefix, olderThanDays = 30) {
    // This would require listing objects and filtering by date
    // Implementation depends on specific cleanup requirements
    console.log(`Cleanup requested for files older than ${olderThanDays} days in ${prefix}`)
  }
}

// Create singleton instance
const s3Service = new S3Service()

export default s3Service

// Export utility functions
export const uploadToS3 = (file, options) => s3Service.uploadFile(file, options)
export const deleteFromS3 = (fileName) => s3Service.deleteFile(fileName)
export const getS3SignedUrl = (fileName, expiresIn) => s3Service.getSignedUrl(fileName, expiresIn)
export const validateImageFile = (file, options) => s3Service.validateFile(file, options)
export const getOptimizedImageUrl = (url, options) => s3Service.getOptimizedImageUrl(url, options)

