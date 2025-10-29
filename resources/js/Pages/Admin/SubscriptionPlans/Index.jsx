import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminSubscriptionPlansIndex({
    plans, // array or paginated: [{id, name, price, currency, interval, days, is_active, created_at}]
}) {
    const formatPrice = (p) =>
        `${(p.currency || "USD").toUpperCase()} ${Number(p.price || 0).toFixed(
            2
        )}`;

    const handleDelete = (id) => {
        if (!confirm("Delete this plan? This cannot be undone.")) return;
        router.delete(route("admin.subscription-plans.destroy", id));
    };

    return (
        <>
            <Head title="Subscription Plans — Admin" />

            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle>Subscription Plans</CardTitle>
                            <Link
                                href={route("admin.subscription-plans.create")}
                            >
                                <Button size="sm">
                                    <Plus className="w-4 h-4 mr-1" />
                                    New Plan
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Interval</TableHead>
                                            <TableHead>Days</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {plans.data
                                            ? plans.data.map((p) => (
                                                  <TableRow key={p.id}>
                                                      <TableCell className="font-medium">
                                                          {p.name}
                                                      </TableCell>
                                                      <TableCell>
                                                          {formatPrice(p)}
                                                      </TableCell>
                                                      <TableCell className="uppercase">
                                                          {p.interval}
                                                      </TableCell>
                                                      <TableCell>
                                                          {p.interval ===
                                                          "lifetime"
                                                              ? "—"
                                                              : p.days}
                                                      </TableCell>
                                                      <TableCell>
                                                          {p.is_active ? (
                                                              <Badge className="bg-green-600">
                                                                  Active
                                                              </Badge>
                                                          ) : (
                                                              <Badge variant="secondary">
                                                                  Inactive
                                                              </Badge>
                                                          )}
                                                      </TableCell>
                                                      <TableCell className="text-right space-x-2">
                                                          <Link
                                                              href={route(
                                                                  "admin.subscription-plans.edit",
                                                                  p.id
                                                              )}
                                                          >
                                                              <Button
                                                                  size="sm"
                                                                  variant="outline"
                                                              >
                                                                  <Pencil className="w-4 h-4 mr-1" />{" "}
                                                                  Edit
                                                              </Button>
                                                          </Link>
                                                          <Button
                                                              size="sm"
                                                              variant="destructive"
                                                              onClick={() =>
                                                                  handleDelete(
                                                                      p.id
                                                                  )
                                                              }
                                                          >
                                                              <Trash2 className="w-4 h-4 mr-1" />{" "}
                                                              Delete
                                                          </Button>
                                                      </TableCell>
                                                  </TableRow>
                                              ))
                                            : plans.map((p) => (
                                                  <TableRow key={p.id}>
                                                      <TableCell className="font-medium">
                                                          {p.name}
                                                      </TableCell>
                                                      <TableCell>
                                                          {formatPrice(p)}
                                                      </TableCell>
                                                      <TableCell className="uppercase">
                                                          {p.interval}
                                                      </TableCell>
                                                      <TableCell>
                                                          {p.interval ===
                                                          "lifetime"
                                                              ? "—"
                                                              : p.days}
                                                      </TableCell>
                                                      <TableCell>
                                                          {p.is_active ? (
                                                              <Badge className="bg-green-600">
                                                                  Active
                                                              </Badge>
                                                          ) : (
                                                              <Badge variant="secondary">
                                                                  Inactive
                                                              </Badge>
                                                          )}
                                                      </TableCell>
                                                      <TableCell className="text-right space-x-2">
                                                          <Link
                                                              href={route(
                                                                  "admin.subscription-plans.edit",
                                                                  p.id
                                                              )}
                                                          >
                                                              <Button
                                                                  size="sm"
                                                                  variant="outline"
                                                              >
                                                                  <Pencil className="w-4 h-4 mr-1" />{" "}
                                                                  Edit
                                                              </Button>
                                                          </Link>
                                                          <Button
                                                              size="sm"
                                                              variant="destructive"
                                                              onClick={() =>
                                                                  handleDelete(
                                                                      p.id
                                                                  )
                                                              }
                                                          >
                                                              <Trash2 className="w-4 h-4 mr-1" />{" "}
                                                              Delete
                                                          </Button>
                                                      </TableCell>
                                                  </TableRow>
                                              ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination (if plans is LengthAwarePaginator) */}
                            {plans.last_page > 1 && (
                                <div className="mt-6 flex justify-center gap-2">
                                    {plans.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || "#"}
                                            className={`px-3 py-2 rounded ${
                                                link.active
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                                            } ${
                                                !link.url
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                            preserveState
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
