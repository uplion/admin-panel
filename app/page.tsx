import prisma from "@/lib/prisma";

export default async function Home() {
  const keys: {
    id: number;
    key: string;
    name: string;
    description: string | null;
    createdAt: Date;
    isQuotaLimited: boolean;
    remainingTokens: number | null;
    isEnabled: boolean;
    expiresAt: Date | null;
    allowedModels: string[];
  }[] = await prisma.apiKey.findMany({
    where: {
      isEnabled: true
    }
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">API Keys</h1>
      <ul className="mt-8">
        {keys.map((key) => (
          <li key={key.id} className="mb-4">
            <h2 className="text-xl font-bold">{key.name}</h2>
            <p className="text-gray-500">{key.description}</p>
            <p className="text-gray-500">{key.key}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
