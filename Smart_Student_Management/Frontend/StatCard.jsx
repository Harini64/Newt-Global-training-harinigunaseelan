import { cn } from '../utils/cn'

const Card = ({ children, className }) => {
  return (
    <div className={cn('card', className)}>
      {children}
    </div>
  )
}

export default Card
