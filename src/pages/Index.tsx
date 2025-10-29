import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DetectorType = "All" | "Sobel" | "Prewitt" | "Canny";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [detector, setDetector] = useState<DetectorType>("All");
  const [processedImages, setProcessedImages] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setProcessedImages({}); // Clear previous results
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please upload a valid image file.",
      });
    }
  };

  const handleDetectorChange = (value: DetectorType) => {
    setDetector(value);
    setProcessedImages({}); // Clear results when changing detector
  };

  const handleRunDetection = () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No Image",
        description: "Please upload an image first.",
      });
      return;
    }

    // Simulate processing (in real app, this would call backend edge detection algorithms)
    toast({
      title: "Processing",
      description: "Running edge detection...",
    });

    // Simulate processing delay
    setTimeout(() => {
      const mockProcessedImages: Record<string, string> = {};
      
      if (detector === "All" || detector === "Sobel") {
        mockProcessedImages.Sobel = imagePreview; // In real app, this would be processed image
      }
      if (detector === "All" || detector === "Prewitt") {
        mockProcessedImages.Prewitt = imagePreview;
      }
      if (detector === "All" || detector === "Canny") {
        mockProcessedImages.Canny = imagePreview;
      }

      setProcessedImages(mockProcessedImages);
      
      toast({
        title: "Complete",
        description: "Edge detection completed successfully.",
      });
    }, 1000);
  };

  const getDisplayLayout = () => {
    if (detector === "All") {
      return ["Sobel", "Prewitt", "Canny"];
    }
    return [detector];
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Control Panel */}
      <aside className="w-80 border-r border-border bg-card/50 backdrop-blur-sm p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Edge Detection
          </h1>
          <p className="text-sm text-muted-foreground">
            Upload an image and detect edges using various algorithms
          </p>
        </div>

        <div className="flex-1 space-y-6">
          {/* Upload Section */}
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full h-12 border-primary/50 hover:bg-primary/10 hover:border-primary transition-all"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            {selectedFile && (
              <p className="text-xs text-muted-foreground truncate px-1">
                {selectedFile.name}
              </p>
            )}
          </div>

          <div className="h-px bg-border" />

          {/* Detector Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold">Select Detector</Label>
            <RadioGroup value={detector} onValueChange={handleDetectorChange}>
              <div className="space-y-3">
                {[
                  { label: "All Detectors", value: "All" },
                  { label: "Sobel Detector", value: "Sobel" },
                  { label: "Prewitt Detector", value: "Prewitt" },
                  { label: "Canny Detector", value: "Canny" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className="cursor-pointer flex-1 text-sm"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="h-px bg-border" />

          {/* Run Button */}
          <Button
            onClick={handleRunDetection}
            disabled={!selectedFile}
            className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-glow"
          >
            Run Detection
          </Button>
        </div>
      </aside>

      {/* Right Display Area */}
      <main className="flex-1 p-8">
        <div className="h-full flex items-center justify-center">
          {!imagePreview ? (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Upload className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">No Image Loaded</h2>
                <p className="text-muted-foreground">
                  Upload an image to get started
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-6xl">
              <div
                className={`grid gap-6 ${
                  detector === "All" ? "grid-cols-2" : "grid-cols-2"
                }`}
              >
                {/* Original Image */}
                <Card className="overflow-hidden bg-gradient-to-br from-card to-card/80 border-border/50 shadow-card">
                  <div className="p-4 border-b border-border/50">
                    <h3 className="font-semibold text-center">Original</h3>
                  </div>
                  <div className="aspect-square bg-secondary/20 flex items-center justify-center p-4">
                    <img
                      src={imagePreview}
                      alt="Original"
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  </div>
                </Card>

                {/* Processed Images */}
                {getDisplayLayout().map((detectorName) => (
                  <Card
                    key={detectorName}
                    className="overflow-hidden bg-gradient-to-br from-card to-card/80 border-border/50 shadow-card"
                  >
                    <div className="p-4 border-b border-border/50">
                      <h3 className="font-semibold text-center">{detectorName}</h3>
                    </div>
                    <div className="aspect-square bg-secondary/20 flex items-center justify-center p-4">
                      {processedImages[detectorName] ? (
                        <img
                          src={processedImages[detectorName]}
                          alt={detectorName}
                          className="max-w-full max-h-full object-contain rounded grayscale contrast-125"
                        />
                      ) : (
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Awaiting processing
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
