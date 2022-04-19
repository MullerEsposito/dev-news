import Head from "next/head";
import { GetStaticProps } from "next";
import { SubscribeButton } from "../components/SubscribeButton";
import styles from './home.module.scss';
import { stripe } from "../services/stripe";


const _24_HOURS_ = 60 * 60 * 24;

type HomeProps = {
  product: {
    id: string;
    amount: string;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home - DevNews</title>f
      </Head>
      <main className={styles.container}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>New about <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br/>
            <span>for { product.amount } month</span>
          </p>
          <SubscribeButton />
        </section>
        <img src="/images/avatar.svg" alt="Girl coding"/>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1IlE1tK124oqylYnviPgfiEQ');

  const product = {
    id: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100)
  }

  return {
    props: {
      product,
    },
    revalidate: _24_HOURS_,
  };
};
