import { Film, Tv, User } from "lucide-react";

const RowContainer = ({
  children,
  title,
  type,
}: {
  children: React.ReactNode;
  title: string;
  type: string;
}) => {
  const typeMap: { [key: string]: React.ReactNode } = {
    movie: <Film className="w-6 h-6" />,
    tv: <Tv className="w-6 h-6" />,
    person: <User className="w-6 h-6" />,
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-xl">
          {typeMap[type] || <Film className="w-6 h-6" />}
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
};
export default RowContainer;
