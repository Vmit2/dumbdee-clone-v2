import React from 'react'
import { cn } from '../../utils/cn'
import { Loader2 } from 'lucide-react'

const buttonVariants = {
  primary: 'btn-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200',
  secondary: 'btn-secondary font-semibold transition-all duration-200',
  tertiary: 'btn-tertiary font-medium transition-all duration-200',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900',
  link: 'bg-transparent underline-offset-4 hover:underline text-blue-600 hover:text-blue-800',
  destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl'
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm h-8',
  md: 'px-4 py-2 text-base h-10',
  lg: 'px-6 py-3 text-lg h-12',
  xl: 'px-8 py-4 text-xl h-14',
  icon: 'h-10 w-10 p-0'
}

const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props
}, ref) => {
  const isDisabled = disabled || loading

  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-lg font-medium',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all duration-200 ease-in-out',
        
        // Variant styles
        buttonVariants[variant],
        
        // Size styles
        buttonSizes[size],
        
        // Full width
        fullWidth && 'w-full',
        
        // Focus ring colors based on variant
        variant === 'primary' && 'focus:ring-dumbdee-golden',
        variant === 'secondary' && 'focus:ring-dumbdee-navy',
        variant === 'tertiary' && 'focus:ring-dumbdee-golden',
        variant === 'destructive' && 'focus:ring-red-500',
        
        className
      )}
      disabled={isDisabled}
      ref={ref}
      {...props}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      
      {leftIcon && !loading && (
        <span className="mr-2 flex items-center">
          {leftIcon}
        </span>
      )}
      
      {children}
      
      {rightIcon && (
        <span className="ml-2 flex items-center">
          {rightIcon}
        </span>
      )}
    </button>
  )
})

Button.displayName = 'Button'

// Specialized button components
export const PrimaryButton = React.forwardRef((props, ref) => (
  <Button variant="primary" ref={ref} {...props} />
))

export const SecondaryButton = React.forwardRef((props, ref) => (
  <Button variant="secondary" ref={ref} {...props} />
))

export const TertiaryButton = React.forwardRef((props, ref) => (
  <Button variant="tertiary" ref={ref} {...props} />
))

export const GhostButton = React.forwardRef((props, ref) => (
  <Button variant="ghost" ref={ref} {...props} />
))

export const LinkButton = React.forwardRef((props, ref) => (
  <Button variant="link" ref={ref} {...props} />
))

export const DestructiveButton = React.forwardRef((props, ref) => (
  <Button variant="destructive" ref={ref} {...props} />
))

// Icon button component
export const IconButton = React.forwardRef(({ 
  icon, 
  'aria-label': ariaLabel, 
  tooltip,
  ...props 
}, ref) => (
  <Button
    size="icon"
    aria-label={ariaLabel}
    title={tooltip || ariaLabel}
    ref={ref}
    {...props}
  >
    {icon}
  </Button>
))

PrimaryButton.displayName = 'PrimaryButton'
SecondaryButton.displayName = 'SecondaryButton'
TertiaryButton.displayName = 'TertiaryButton'
GhostButton.displayName = 'GhostButton'
LinkButton.displayName = 'LinkButton'
DestructiveButton.displayName = 'DestructiveButton'
IconButton.displayName = 'IconButton'

export default Button

