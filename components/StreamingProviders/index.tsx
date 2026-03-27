import { WatchProviderRegion } from "@/lib/TVDetails";
import { ExternalLink, Tv } from "lucide-react";
import Image from "next/image";

interface Props {
  providers: WatchProviderRegion;
  compact?: boolean;
}

const ProviderBadge = ({ provider }: { provider: { logoPath: string; providerName: string } }) => (
  <div className="group relative flex-shrink-0" title={provider.providerName}>
    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/20 hover:border-white/50 transition-all hover:scale-110 shadow-lg">
      <Image
        src={provider.logoPath}
        alt={provider.providerName}
        width={40}
        height={40}
        className="object-cover w-full h-full"
      />
    </div>
    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white bg-black/80 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
      {provider.providerName}
    </div>
  </div>
);

export default function StreamingProviders({ providers, compact = false }: Props) {
  const hasAny = providers.flatrate?.length || providers.rent?.length || providers.buy?.length;
  if (!hasAny) return null;

  return (
    <div className={`backdrop-blur-lg bg-white/10 rounded-2xl p-5 border border-white/20 ${compact ? "" : "max-w-2xl"}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tv className="w-5 h-5 text-cyan-400" />
          <h3 className="text-white font-bold text-base">Where to Watch</h3>
        </div>
        {providers.link && (
          <a
            href={providers.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-400 hover:text-white text-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            All options
          </a>
        )}
      </div>

      <div className="space-y-4">
        {providers.flatrate && providers.flatrate.length > 0 && (
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Streaming</p>
            <div className="flex flex-wrap gap-2">
              {providers.flatrate.map((p) => (
                <ProviderBadge key={p.providerId} provider={p} />
              ))}
            </div>
          </div>
        )}
        {providers.rent && providers.rent.length > 0 && (
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Rent</p>
            <div className="flex flex-wrap gap-2">
              {providers.rent.map((p) => (
                <ProviderBadge key={p.providerId} provider={p} />
              ))}
            </div>
          </div>
        )}
        {providers.buy && providers.buy.length > 0 && (
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Buy</p>
            <div className="flex flex-wrap gap-2">
              {providers.buy.map((p) => (
                <ProviderBadge key={p.providerId} provider={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
