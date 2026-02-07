import { motion } from "framer-motion";
import { CheckCircle2, CreditCard, DollarSign, Store, Globe, Shield, Zap, ArrowRight, Smartphone, Receipt, Clock, BadgeCheck } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function PaymentProcessing() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Payment Processing - Zero Fees | Edify Hawaii IT Services"
        description="Accept credit cards in-store and online with zero monthly fees and zero processing fees. $500 one-time terminal cost. Your customers cover processing. Hawaii's best payment solution."
      />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center space-y-6"
          >
            <motion.div variants={scaleIn} className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-5 py-2">
              <CreditCard className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Payment Processing</span>
            </motion.div>

            <motion.h1 data-testid="text-payment-hero-title" variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight">
              Stop Paying <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400">
                Processing Fees
              </span>
            </motion.h1>

            <motion.p data-testid="text-payment-hero-description" variants={fadeInUp} className="text-xl text-slate-400 max-w-2xl mx-auto">
              $500 for a payment terminal. No monthly fees. No processing fees. Your customers cover the small surcharge—you keep 100% of every sale.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/contact" data-testid="link-get-terminal">
                <Button
                  size="lg"
                  data-testid="button-get-terminal"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-2xl shadow-green-500/30"
                >
                  Get Your Terminal
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact" data-testid="link-ask-question-payment">
                <Button
                  size="lg"
                  variant="outline"
                  data-testid="button-learn-more-payment"
                  className="border-white/20 text-white"
                >
                  Ask a Question
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-16"
          >
            <div className="text-center">
              <motion.h2 data-testid="text-how-it-works-title" variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                How It Works
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-2xl mx-auto">
                Traditional processors take 2-4% of every sale. Our model flips that—your customer pays a small surcharge, and you keep every dollar.
              </motion.p>
            </div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeInUp} className="relative p-8 rounded-2xl bg-slate-900/50 border border-white/10 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-bold text-white">
                  Step 01
                </div>
                <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit mx-auto text-green-400">
                  <DollarSign className="w-8 h-8" />
                </div>
                <h3 data-testid="text-step-1-title" className="text-xl font-bold font-display mb-3 text-white">Pay $500 Once</h3>
                <p className="text-slate-400 leading-relaxed">One-time purchase for your payment terminal. No contracts, no commitments, no monthly bills.</p>
              </motion.div>

              <motion.div variants={fadeInUp} className="relative p-8 rounded-2xl bg-slate-900/50 border border-white/10 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-bold text-white">
                  Step 02
                </div>
                <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit mx-auto text-green-400">
                  <Store className="w-8 h-8" />
                </div>
                <h3 data-testid="text-step-2-title" className="text-xl font-bold font-display mb-3 text-white">Start Accepting Payments</h3>
                <p className="text-slate-400 leading-relaxed">We set up and train you on your terminal. Accept cards in-store and online from day one.</p>
              </motion.div>

              <motion.div variants={fadeInUp} className="relative p-8 rounded-2xl bg-slate-900/50 border border-white/10 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-bold text-white">
                  Step 03
                </div>
                <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit mx-auto text-green-400">
                  <BadgeCheck className="w-8 h-8" />
                </div>
                <h3 data-testid="text-step-3-title" className="text-xl font-bold font-display mb-3 text-white">Keep 100% of Sales</h3>
                <p className="text-slate-400 leading-relaxed">Your customers cover the small processing surcharge. You receive the full sale amount—no deductions.</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <div className="text-center">
              <motion.h2 data-testid="text-comparison-title" variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                See the Difference
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-2xl mx-auto">
                Compare what you'd pay with a traditional processor vs. our zero-fee solution.
              </motion.p>
            </div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Traditional */}
              <motion.div variants={fadeInUp}>
                <Card className="p-8 bg-slate-900/80 border-white/10">
                  <div className="text-center space-y-6">
                    <h3 data-testid="text-traditional-title" className="text-2xl font-display font-bold text-slate-400">Traditional Processor</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 py-2 border-b border-white/5">
                        <span className="text-slate-400">Terminal Cost</span>
                        <span className="text-white font-medium">$200 - $800</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 py-2 border-b border-white/5">
                        <span className="text-slate-400">Monthly Fee</span>
                        <span className="text-red-400 font-medium">$25 - $100/mo</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 py-2 border-b border-white/5">
                        <span className="text-slate-400">Processing Fee</span>
                        <span className="text-red-400 font-medium">2.5% - 3.5% per sale</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 py-2 border-b border-white/5">
                        <span className="text-slate-400">On $10,000/mo Sales</span>
                        <span className="text-red-400 font-medium">-$250 to -$350 lost</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 py-2">
                        <span className="text-slate-400">Annual Cost</span>
                        <span className="text-red-400 font-bold text-lg">$3,600 - $5,400</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Edify */}
              <motion.div variants={fadeInUp}>
                <Card className="p-8 bg-gradient-to-br from-green-950/50 to-emerald-950/50 border-green-500/30 ring-1 ring-green-500/20">
                  <div className="text-center space-y-6">
                    <div className="flex items-center justify-center gap-2">
                      <h3 data-testid="text-edify-title" className="text-2xl font-display font-bold text-green-400">Edify Payment Processing</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 py-2 border-b border-green-500/10">
                        <span className="text-slate-400">Terminal Cost</span>
                        <span className="text-white font-medium">$500 (one-time)</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 py-2 border-b border-green-500/10">
                        <span className="text-slate-400">Monthly Fee</span>
                        <span className="text-green-400 font-medium">$0</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 py-2 border-b border-green-500/10">
                        <span className="text-slate-400">Processing Fee</span>
                        <span className="text-green-400 font-medium">$0 (customer pays)</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 py-2 border-b border-green-500/10">
                        <span className="text-slate-400">On $10,000/mo Sales</span>
                        <span className="text-green-400 font-medium">You keep $10,000</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 py-2">
                        <span className="text-slate-400">Annual Cost</span>
                        <span className="text-green-400 font-bold text-lg">$0 after terminal</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <p data-testid="text-savings-summary" className="text-slate-400 text-lg">
                On $10,000/month in sales, you could save <span className="text-green-400 font-bold">$3,600 - $5,400 per year</span> compared to traditional processors.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-16"
          >
            <div className="text-center">
              <motion.h2 data-testid="text-features-title" variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                Everything You Need
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-2xl mx-auto">
                In-store and online payment capabilities, all included with your terminal.
              </motion.p>
            </div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Store className="w-6 h-6" />}
                title="In-Store Terminal"
                description="Professional countertop terminal that accepts swipe, chip, and tap payments."
              />
              <FeatureCard
                icon={<Globe className="w-6 h-6" />}
                title="Online Payments"
                description="Accept payments through your website with a secure online gateway."
              />
              <FeatureCard
                icon={<Smartphone className="w-6 h-6" />}
                title="Digital Wallets"
                description="Accept Apple Pay, Google Pay, and other contactless payment methods."
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6" />}
                title="PCI Compliant"
                description="Bank-level security protects every transaction and customer data."
              />
              <FeatureCard
                icon={<Clock className="w-6 h-6" />}
                title="Next-Day Deposits"
                description="Funds deposited to your bank account by the next business day."
              />
              <FeatureCard
                icon={<Receipt className="w-6 h-6" />}
                title="Transaction Dashboard"
                description="Real-time reporting to track sales, refunds, and daily totals."
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* In-Store & Online Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-emerald-400 rounded-xl shadow-lg w-fit">
                <Store className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h2 data-testid="text-instore-title" variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold text-white">
                In-Store Payments
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 leading-relaxed">
                Your terminal handles everything at the counter—credit cards, debit cards, chip, swipe, and contactless tap. Quick setup and training included so you're accepting payments on day one.
              </motion.p>

              <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <FeatureItem text="Chip & Swipe Cards" />
                <FeatureItem text="Contactless/NFC Tap" />
                <FeatureItem text="Digital Receipts" />
                <FeatureItem text="Tip Adjustment" />
                <FeatureItem text="Quick Setup" />
                <FeatureItem text="Training Included" />
              </motion.div>
            </div>

            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl shadow-lg w-fit">
                <Globe className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h2 data-testid="text-online-title" variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold text-white">
                Online Payments
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 leading-relaxed">
                Sell online with our secure payment gateway. Whether you have an e-commerce store or just need to take deposits remotely, we've got you covered—same zero-fee model.
              </motion.p>

              <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <FeatureItem text="Secure Checkout" />
                <FeatureItem text="Invoice Payments" />
                <FeatureItem text="E-Commerce Integration" />
                <FeatureItem text="Recurring Billing" />
                <FeatureItem text="Payment Links" />
                <FeatureItem text="Mobile Optimized" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center space-y-8"
          >
            <motion.h2 data-testid="text-payment-cta-title" variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold text-white">
              Ready to Keep More of Your Money?
            </motion.h2>
            <motion.p data-testid="text-payment-cta-description" variants={fadeInUp} className="text-xl text-slate-400 max-w-2xl mx-auto">
              Get your $500 terminal and start accepting payments with zero ongoing fees. Setup takes minutes, not weeks.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/contact" data-testid="link-get-terminal-cta">
                <Button
                  size="lg"
                  data-testid="button-get-started-payment-cta"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-2xl shadow-green-500/30"
                >
                  Get Your Terminal Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact" data-testid="link-questions-payment">
                <Button
                  size="lg"
                  variant="outline"
                  data-testid="button-questions-payment"
                  className="border-white/20 text-white"
                >
                  Have Questions? Let's Talk
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-6 pt-6 text-slate-400 text-sm">
              <span data-testid="text-badge-setup" className="flex items-center gap-2"><Zap className="w-4 h-4 text-green-400" /> Same-Day Setup</span>
              <span data-testid="text-badge-pci" className="flex items-center gap-2"><Shield className="w-4 h-4 text-green-400" /> PCI Compliant</span>
              <span data-testid="text-badge-zero-fees" className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-400" /> Zero Monthly Fees</span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <motion.div variants={fadeInUp} className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
      </div>
      <span className="text-slate-300 font-medium">{text}</span>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 space-y-4"
    >
      <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 w-fit shadow-lg">
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-lg font-bold font-display text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
