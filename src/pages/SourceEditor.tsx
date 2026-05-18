import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSourceMutations, useSourceQuery } from "@/hooks/useSources";
import { useToast } from "@/hooks/useToast";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  avatarUrl: z.string().optional(),
  bio: z.string().optional(),
  websiteUrl: z.string().optional(),
  isVerified: z.boolean().default(false),
  isActive: z.boolean().default(true)
});

type SourceFormValues = z.infer<typeof schema>;

export function SourceEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: source } = useSourceQuery(id);
  const { create, update } = useSourceMutations();
  const { push } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SourceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      avatarUrl: "",
      bio: "",
      websiteUrl: "",
      isVerified: false,
      isActive: true
    }
  });

  useEffect(() => {
    if (source) {
      reset({
        name: source.name,
        slug: source.slug,
        avatarUrl: source.avatarUrl,
        bio: source.bio,
        websiteUrl: source.websiteUrl,
        isVerified: source.isVerified,
        isActive: source.isActive
      });
    }
  }, [source, reset]);

  const onSubmit = async (values: SourceFormValues) => {
    if (id) {
      await update.mutateAsync({ id, payload: values });
      push({ title: "Source updated", description: "Source saved." });
      return;
    }
    const newId = await create.mutateAsync(values);
    push({ title: "Source created", description: "Source created." });
    navigate(`/sources/${newId}`);
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{id ? "Edit Source" : "Create Source"}</h1>
          <p className="text-sm text-muted-foreground">Manage publisher profiles and verification.</p>
        </div>
        <Button className="bg-muted text-foreground" type="button" onClick={() => navigate("/sources")}>Back</Button>
      </div>

      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Name</label>
            <Input placeholder="Name" {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Slug</label>
            <Input placeholder="slug" {...register("slug")} />
            {errors.slug && <p className="mt-1 text-xs text-danger">{errors.slug.message}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Avatar URL</label>
            <Input placeholder="https://" {...register("avatarUrl")} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Website URL</label>
            <Input placeholder="https://" {...register("websiteUrl")} />
          </div>
        </div>
      </Card>

      <Card>
        <label className="text-xs font-semibold text-muted-foreground">Bio</label>
        <Textarea className="min-h-[120px]" placeholder="Source bio" {...register("bio")} />
      </Card>

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs text-muted-foreground">Verified</label>
          <input type="checkbox" {...register("isVerified")} defaultChecked={source?.isVerified} />
          <label className="text-xs text-muted-foreground">Active</label>
          <input type="checkbox" {...register("isActive")} defaultChecked={source?.isActive} />
        </div>
      </Card>

      <Button type="submit">Save Source</Button>
    </form>
  );
}
