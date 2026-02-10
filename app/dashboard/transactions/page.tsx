import { Suspense } from "react";
import Search from "@/app/components/search";
import { fetchTransactionPages } from "@/app/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { SkeletonTable } from "@/app/components/skletons/table-skleton";
import Table from "@/app/components/transactions/table";
import Pagination from "@/app/components/transactions/pagination";
import { TransactionFilters } from "@/app/components/transactions/transaction-filters";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchTransactionPages(query);
  return (
    <div className="bg-muted/60 rounded-xl p-4">
      <h1 className="text-2xl mb-6">Transactions</h1>
      <div className="flex items-center justify-between gap-2 mb-6 w-full ml-0 lg:w-2/4 lg:ml-auto">
        <Search placeholder="Search transactions..." />

        <Button asChild>
          <Link
            href="/dashboard/transactions/create"
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            New Transaction
          </Link>
        </Button>
      </div>
      {/* <div className="flex items-center p-4 justify-end">
        <TransactionFilters />
      </div> */}
      <Suspense key={query + currentPage} fallback={<SkeletonTable />}>
        <Table
          query={query}
          currentPage={currentPage}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
