export default function Footer(){
  return (
    <footer className="mt-10 border-t bg-black/5">
      <div className="max-w-7xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-4 text-sm">
        <div>
          <div className="font-semibold mb-2">Get to Know Us</div>
          <ul className="grid gap-1">
            <li><a className="underline" href="/blog">Blog</a></li>
            <li><a className="underline" href="/store/dummy-vendor">About DumbDee</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Make Money with Us</div>
          <ul className="grid gap-1">
            <li><a className="underline" href="/vendor">Sell products</a></li>
            <li><a className="underline" href="/vendor">Advertise your products</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Payment & Shipping</div>
          <ul className="grid gap-1">
            <li>Razorpay, Stripe</li>
            <li>Shipway, Shiprocket</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Let Us Help You</div>
          <ul className="grid gap-1">
            <li><a className="underline" href="/orders">Your Orders</a></li>
            <li><a className="underline" href="/profile">Your Account</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs py-3">© {new Date().getFullYear()} DumbDee</div>
    </footer>
  );
}


