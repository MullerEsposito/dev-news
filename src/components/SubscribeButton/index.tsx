import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

export function SubscribeButton() {
  const [session] = useSession();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!session) {
      signIn('github');
      return;
    }

    if (session.activeSubscription) {
      router.push('/posts');
      return;
    }

    try {
      const { data: { sessionId } } = await api.post('/subscribe');
      
      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      alert(error.message);
    }
  }
  
  return (
    <button 
      className={styles.container}
      onClick={ handleSubscribe }
    >
      Subscribe now
    </button>
  )
}