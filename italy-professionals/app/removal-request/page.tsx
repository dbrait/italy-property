import { Metadata } from 'next'
import { RemovalRequestForm } from './RemovalRequestForm'

export const metadata: Metadata = {
  title: 'Request Listing Removal | Italy Professionals',
  description: 'Request removal of your listing from the Italy Professionals directory.',
}

export default function RemovalRequestPage() {
  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Request Listing Removal</h1>

      <div className="prose prose-sm text-muted-foreground mb-8">
        <p>
          If you are listed in our directory and would like to be removed, please fill out
          the form below. We respect your right to privacy and will process your request
          promptly.
        </p>
        <p>
          Please note that we require verification that you are authorized to request
          removal of the listing. We will contact you at the email address provided to
          verify your identity before removing the listing.
        </p>
        <p>
          Removal requests are typically processed within 5 business days.
        </p>
      </div>

      <RemovalRequestForm />
    </div>
  )
}
