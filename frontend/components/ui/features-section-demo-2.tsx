import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";
import { Users, TrendingUp, ShieldAlert, DollarSign } from "lucide-react";

export default function FeaturesSectionDemo() {
  const features = [
    {
      title: "Production-Ready Code",
      description:
        "Export your visual pipelines as clean, executable Python code for deployment anywhere.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Drag-and-Drop Interface",
      description:
        "Intuitive node-based editor makes building complex ML workflows as easy as connecting dots.",
      icon: <IconEaseInOut />,
    },
    {
      title: "Cost-Effective Scaling",
      description:
        "Train on our optimized infrastructure or export to run on your own hardware.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "Instant Deployment",
      description: "One-click deployment of your trained models to scalable cloud endpoints.",
      icon: <IconCloud />,
    },
    {
      title: "End-to-End Pipelines",
      description: "Handle everything from data ingestion and cleaning to training and evaluation in one flow.",
      icon: <IconRouteAltLeft />,
    },
    {
      title: "Intelligent Assistants",
      description:
        "Built-in AI guidance to help you choose the right algorithms and hyper-parameters.",
      icon: <IconHelp />,
    },
    {
      title: "Auto-Tuning",
      description:
        "Automated hyperparameter optimization ensures you always get the best performing model.",
      icon: <IconAdjustmentsBolt />,
    },
    {
      title: "Open Source Core",
      description: "Built on transparent, open-source technologies that the data science community loves.",
      icon: <IconHeart />,
    },
  ];

  const useCases = [
    {
      title: "Predict Customer Churn",
      description: "Identify at-risk customers before they leave using historical engagement data.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Sales Forecasting",
      description: "Predict future sales trends to optimize inventory and revenue projections.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Fraud Detection",
      description: "Detect anomalous patterns in real-time transactions to prevent financial loss.",
      icon: <ShieldAlert className="w-6 h-6" />,
    },
    {
      title: "Dynamic Pricing",
      description: "Optimize product pricing based on demand, competition, and market trends.",
      icon: <DollarSign className="w-6 h-6" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto relative z-10 py-10">
      <div className="px-4 mb-8">
        <h2 className="text-4xl font-bold mb-4">Features</h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Everything you need to build powerful machine learning models, simplified.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 mb-20">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>

      <div className="px-4 mb-8 text-end">
        <h2 className="text-4xl font-bold mb-4">Use Cases</h2>
        <p className="text-lg text-muted-foreground ">
          Real-world applications where AutoML Studio drives impact.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10">
        {useCases.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        (index !== 3 && index !== 7) && "lg:border-r lg:border-dashed",
        "flex flex-col lg:border-dashed py-10 relative group/feature dark:border-primary/20",
        (index === 0 || index === 4) && "dark:border-primary/20",
        index < 4 && "lg:border-b dark:border-primary/20 dark:border-dashed"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-linear-to-t from-neutral-100 dark:from-primary/20 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-linear-to-b from-neutral-100 dark:from-primary/20 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-primary">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-primary/20 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
