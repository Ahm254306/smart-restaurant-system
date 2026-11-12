import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function NotFound() {
  return (
    <div className="container-page py-20">
      <EmptyState
        icon={Compass}
        title="Page not found"
        text="The page you’re looking for doesn’t exist or has moved."
        action={<Link to="/" className="btn-primary">Back to home</Link>}
      />
    </div>
  );
}
