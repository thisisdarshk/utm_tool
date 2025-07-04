import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What are UTM parameters?",
      answer: (
        <p>
          UTM parameters are tags added to URLs to track the effectiveness of online marketing campaigns. 
          They help analytics platforms like Google Analytics 4 identify the source, medium, and campaign 
          name that drove traffic to your website.
        </p>
      )
    },
    {
      question: "Why should I use UTM parameters?",
      answer: (
        <p>
          UTM parameters provide valuable insights into which marketing channels and campaigns are driving 
          traffic and conversions. They help you make data-driven decisions about where to allocate your 
          marketing budget and how to optimize your campaigns.
        </p>
      )
    },
    {
      question: "What's the difference between utm_source and utm_medium?",
      answer: (
        <div>
          <p><strong>utm_source</strong> identifies where the traffic comes from (e.g., google, facebook, newsletter).</p>
          <p><strong>utm_medium</strong> identifies what type of link was used (e.g., cpc, email, social).</p>
        </div>
      )
    },
    {
      question: "How do GA4 channel definitions work?",
      answer: (
        <p>
          GA4 uses predefined channel groupings to categorize your traffic based on the utm_source, 
          utm_medium, and other parameters. Our tool predicts which GA4 channel your parameters will 
          be assigned to, helping you ensure consistent tracking across campaigns.
        </p>
      )
    },
    {
      question: "Can I save my UTM configurations for future use?",
      answer: (
        <p>
          Yes! Our UTM Parameter Builder allows you to save templates for each platform. 
          This makes it easy to maintain consistent UTM parameters across campaigns and 
          quickly generate new tracking URLs.
        </p>
      )
    },
    {
      question: "What's the best practice for naming conventions?",
      answer: (
        <div>
          <p>For consistent tracking, we recommend:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Use lowercase consistently</li>
            <li>Use underscores (_) or hyphens (-) instead of spaces</li>
            <li>Be consistent with naming across campaigns</li>
            <li>Keep parameter values concise but descriptive</li>
            <li>Document your UTM naming strategy for team alignment</li>
          </ul>
        </div>
      )
    },
    {
      question: "How do I use platform-specific parameters like ValueTrack?",
      answer: (
        <p>
          Our tool includes platform-specific builders for Google Ads (ValueTrack parameters), 
          Microsoft Ads, Meta, TikTok, Pinterest, Reddit, and Snapchat. Each builder includes 
          the official parameters and macros for that platform, making it easy to create 
          advanced tracking templates.
        </p>
      )
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6" id="faq-heading">
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              className="flex items-center justify-between w-full p-4 text-left bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
            
            {openIndex === index && (
              <div 
                id={`faq-answer-${index}`}
                className="p-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;