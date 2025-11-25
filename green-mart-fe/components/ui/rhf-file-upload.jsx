import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Upload, X, FileIcon } from "lucide-react";
import { useState, useEffect } from "react";
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
    const newFiles = Array.from(e.target.files || []);

    if (!newFiles.length) return;

    let allFiles;
    if (multiple) {
      // Multiple: merge với files cũ
      allFiles = [
        ...(Array.isArray(field.value) ? field.value : []),
        ...newFiles,
      ];

      // Check max files
      if (allFiles.length > maxFiles) {
        alert(`Chỉ được chọn tối đa ${maxFiles} file`);
        allFiles = allFiles.slice(0, maxFiles);
      }
    } else {
      // Single: chỉ lấy file đầu tiên
      allFiles = [newFiles[0]];
    }

    // Tạo previews
    const newPreviews = allFiles.map((file) => {
      const isPdf = file.type === "application/pdf";
      return {
        url: isPdf ? null : URL.createObjectURL(file),
        name: file.name,
        type: file.type,
        isPdf,
        file,
      };
    });

    setPreviews(newPreviews);

    // Update field value
    if (multiple) {
      field.onChange(allFiles);
    } else {
      field.onChange(allFiles[0]); // Single file: return File object trực tiếp
    }

    // Reset input
    e.target.value = "";
  };

  const removePreview = (index, field) => {
    const newPreviews = [...previews];

    // Revoke URL
    if (newPreviews[index]?.url) {
      URL.revokeObjectURL(newPreviews[index].url);
    }

    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    if (multiple) {
      const currentFiles = Array.isArray(field.value) ? [...field.value] : [];
      currentFiles.splice(index, 1);
      field.onChange(currentFiles.length > 0 ? currentFiles : undefined);
    } else {
      field.onChange(undefined);
    }
  };

  // Cleanup URLs khi unmount
  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, []);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => {
        // Sync previews với value
        useEffect(() => {
          if (!value) {
            setPreviews([]);
          } else {
            const files = Array.isArray(value) ? value : [value];
            if (files.length !== previews.length) {
              const newPreviews = files.map((file) => {
                const isPdf = file.type === "application/pdf";
                return {
                  url: isPdf ? null : URL.createObjectURL(file),
                  name: file.name,
                  type: file.type,
                  isPdf,
                  file,
                };
              });
              setPreviews(newPreviews);
            }
          }
        }, [value]);

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="space-y-4">
                {/* Upload Area */}
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
                      {multiple
                        ? `Đã chọn ${previews.length}/${maxFiles} file`
                        : previews.length > 0
                        ? "Đã chọn 1 file"
                        : "Chưa chọn file"}
                    </div>
                  </label>
                </div>

                {/* Previews */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        {preview.isPdf ? (
                          <div className="w-full h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center border">
                            <FileIcon className="w-12 h-12 text-red-500" />
                            <span className="text-xs mt-2 text-red-600 font-semibold">
                              PDF
                            </span>
                          </div>
                        ) : (
                          <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border">
                            <img
                              src={preview.url}
                              alt={preview.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
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
        );
      }}
    />
  );
}
