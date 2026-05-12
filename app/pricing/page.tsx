'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2 } from 'lucide-react'
import { createCheckoutSession } from '@/app/actions/stripe'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (productId: string) => {
    setLoading(productId)
    try {
      const { url } = await createCheckoutSession(productId)
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setLoading(null)
    }
  }

  const features = {
    free: [
      '3 conversions per day',
      'Basic compression',
      'Max 10MB file size',
      'Standard processing speed',
    ],
    pro: [
      'Unlimited conversions',
      'Advanced compression',
      'Max 100MB file size',
      'Priority processing',
      'No ads',
      'File history & dashboard',
      'Priority support',
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={null} />
      
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {/* Free Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>For occasional use</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {features.free.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="mt-8 w-full" asChild>
                  <a href="/">Get Started</a>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-primary">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>For power users</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$4.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {features.pro.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="mt-8 w-full" 
                  onClick={() => handleSubscribe('pdfly-pro-monthly')}
                  disabled={loading === 'pdfly-pro-monthly'}
                >
                  {loading === 'pdfly-pro-monthly' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Subscribe Monthly'
                  )}
                </Button>
                <Button 
                  variant="outline"
                  className="mt-3 w-full" 
                  onClick={() => handleSubscribe('pdfly-pro-yearly')}
                  disabled={loading === 'pdfly-pro-yearly'}
                >
                  {loading === 'pdfly-pro-yearly' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Subscribe Yearly 
                      <Badge variant="secondary" className="ml-2">Save 40%</Badge>
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <div className="mx-auto mt-20 max-w-2xl">
            <h2 className="mb-8 text-center text-2xl font-bold">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold">Can I cancel anytime?</h3>
                <p className="mt-1 text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">What payment methods do you accept?</h3>
                <p className="mt-1 text-muted-foreground">
                  We accept all major credit cards through Stripe, including Visa, Mastercard, and American Express.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Is there a free trial?</h3>
                <p className="mt-1 text-muted-foreground">
                  Our free plan lets you try all features with limited daily usage. No credit card required.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Are my files secure?</h3>
                <p className="mt-1 text-muted-foreground">
                  Absolutely. All files are encrypted during transfer and automatically deleted after processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
