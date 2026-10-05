import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { QUESTIONNAIRE_URL } from "@/config/site.config";
import Link from "next/link";

const articles = {
  "keeping-your-tax-records-organised": {
    title: "Keeping your tax records organised",
    category: "TAX BASICS",
    image: "/images/home/house-front.webp",
    content: `Maintaining well-organised tax records is foundational for every individual and business. Proper record-keeping simplifies tax time, reduces stress, and ensures you never miss claiming eligible deductions.

Start by establishing a consistent filing system—whether digital or physical. Keep invoices, receipts, bank statements and payslips in one secure location, organised by category and date. For digital records, use cloud storage with regular backups to protect against loss.

Review your records quarterly rather than waiting until tax time. This lets you catch discrepancies early and reconcile accounts while details are fresh. Use accounting software to automate categorisation and reduce manual entry errors.

Retain records for at least five years to meet Australian Tax Office requirements. This protects you if the ATO ever queries your returns. Include evidence of income, expenses, capital items, and any major financial decisions.

A few minutes each week organising records saves hours during tax preparation and gives you confidence your finances are accurate and compliant.`
  },
  "what-to-prepare-before-meeting-an-accountant": {
    title: "What to prepare before meeting an accountant",
    category: "WORKING WITH AN ACCOUNTANT",
    image: "/images/home/client-meeting.webp",
    content: `Meeting with an accountant is more productive when you arrive prepared. Having the right documents and information ready helps your accountant understand your situation and identify opportunities you might miss.

Gather all financial records from the past 12 months: bank statements, payslips, invoices, receipts, and any records of business expenses. If you're self-employed or own a business, bring GST records, superannuation contributions, and loan documents.

List your key questions and priorities. Are you planning to invest? Considering a business structure change? Worried about your tax position? Knowing what matters most helps your accountant focus on areas that impact you most.

Bring identification and any previous tax returns. This gives context to your situation and shows trends over time. If anything unusual happened—a property sale, inheritance, or business acquisition—mention it upfront.

If you use accounting software or spreadsheets to track expenses, bring those too. Even rough records help your accountant get up to speed without starting from scratch.

Take notes during your meeting and ask questions if anything is unclear. A good accountant explains things in plain language, not jargon. You should leave feeling confident about your tax situation and financial direction.`
  },
  "choosing-accounting-software-for-your-business": {
    title: "Choosing accounting software for your business",
    category: "BUSINESS TOOLS",
    image: "/images/home/city-desk-laptop.webp",
    content: `Modern accounting software transforms how businesses manage finances, making it easier to stay on top of invoices, expenses, and GST obligations. The right choice depends on your business size, complexity, and budget.

Cloud-based software offers flexibility and accessibility from anywhere. You can access real-time reports, collaborate with your accountant, and automate repetitive tasks like invoice reminders. Popular options include MYOB, Xero, and Wave, each with different price points and feature sets.

Consider your specific needs: do you invoice clients, manage multiple projects, or track inventory? Do you need payroll integration or multi-currency support? Start with core features you actually use rather than paying for functionality you won't touch.

Integration with your bank is essential. Automatic bank feeds save time categorising transactions and reduce entry errors. Check that your software connects with your bank and other tools you rely on.

Test-drive software before committing. Most providers offer free trials letting you explore the interface and workflows. Involve your team—whoever uses it daily should feel comfortable navigating it.

Budget for training time. Even intuitive software requires some learning. Many providers offer tutorials and support, and your accountant can guide you on best practices.

Start simple and grow. You can upgrade to more sophisticated features as your business scales, or switch providers if your needs change.`
  },
  "planning-ahead-for-tax-time": {
    title: "Planning ahead for tax time",
    category: "SMALL BUSINESS",
    image: "/images/home/cafe-owner-man.webp",
    content: `Tax time feels less overwhelming when you plan ahead. Starting early means you're never scrambling for documents and you have time to explore deductions and optimise your position before the deadline.

Set a schedule three months before tax due date. This gives you time to gather records, identify gaps, and discuss strategy with your accountant. If you're disorganised, start even earlier.

Calculate estimated tax liability so you're not surprised by a big bill. If you expect to owe more than last year, consider making quarterly tax instalments to spread the burden. This also reduces interest if you pay late.

Review potential deductions specific to your situation. Did you upgrade equipment? Work from home? Invest in professional development? Document these with receipts and discuss eligibility with your accountant—some deductions have specific rules.

Discuss superannuation strategy early. Salary sacrifice contributions can lower your tax and boost retirement savings. Explore whether concessional contributions make sense for your circumstances.

If you have investments, rental property income, or side business activities, gather those records early too. These add complexity but planning ahead prevents last-minute stress.

Talk to your accountant about structure—sole trader, partnership, company, or trust. Your structure affects taxes, liability protection, and flexibility. Changing it mid-year is possible but requires planning.

Finally, mark tax due dates in your calendar and set reminders. In Australia, individual tax returns are typically due 31 October (or later if using a tax agent).`
  }
};

export const metadata: Metadata = {
  title: "Tax & Accounting Articles | Your Accountant Match",
  description: "Practical articles on tax, business, super and accounting.",
};

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug as keyof typeof articles];
  if (!article) notFound();

  return (
    <main className="container-page py-10 md:py-14">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase px-3 py-1 rounded-full mb-4">{article.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">{article.title}</h1>
        </div>

        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image src={article.image} alt={article.title} fill className="object-cover" />
        </div>

        <div className="prose prose-lg max-w-none mb-8 text-navy-900">
          {article.content.split('\n\n').map((paragraph, i) => <p key={i} className="mb-4 leading-relaxed">{paragraph}</p>)}
        </div>

        <div className="border-t pt-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <Link href="/#insights" className="text-green-700 font-semibold hover:text-green-800">← Back to all articles</Link>
          <Link href={QUESTIONNAIRE_URL} className="btn btn-primary">Find My Accountant</Link>
        </div>
      </div>
    </main>
  );
}
