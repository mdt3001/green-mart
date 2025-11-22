import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Upload, X, FileIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function RHFFileUpload({
  name,
  label,
  control,
  accept = "image/*",
  multiple = false,
  maxFiles = 1,
}) {
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files || []);

    if (multiple && files.length > maxFiles) {
      alert(`Chỉ được chọn tối đa ${maxFiles} file`);
      return;
    }

    const newPreviews = files.map((file) => {
      const isPdf = file.type === "application/pdf";
      return {
        url: isPdf ? null : URL.createObjectURL(file),
        name: file.name,
        type: file.type,
        isPdf,
      };
    });

    setPreviews(newPreviews);
    field.onChange(multiple ? files : files[0]);
  };

  const removePreview = (index, field) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);

    if (multiple) {
      const currentFiles = Array.from(field.value || []);
      currentFiles.splice(index, 1);
      field.onChange(currentFiles.length > 0 ? currentFiles : undefined);
    } else {
      field.onChange(undefined);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept={accept}
                  multiple={multiple}
                  className="hidden"
                  id={name}
                  onChange={(e) =>
                    handleFileChange(e, { value, onChange, ...field })
                  }
                  {...field}
                />
                <label
                  htmlFor={name}
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">
                      Click để upload
                    </span>{" "}
                    hoặc kéo thả file vào đây
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {multiple ? `Tối đa ${maxFiles} file` : "Chỉ chọn 1 file"}
                  </div>
                </label>
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      {preview.isPdf ? (
                        <div className="w-full h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                          <FileIcon className="w-12 h-12 text-red-500" />
                          <span className="text-xs mt-2">PDF</span>
                        </div>
                      ) : (
                        <img
                          src={preview.url}
                          alt={preview.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                        onClick={() =>
                          removePreview(index, { value, onChange, ...field })
                        }
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {preview.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
