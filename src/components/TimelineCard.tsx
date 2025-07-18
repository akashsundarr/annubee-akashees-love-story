
import { useState } from 'react';
import { Upload, X, Edit, Save, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TimelineCardProps {
  isEditable?: boolean;
  initialTitle?: string;
  initialDate?: string;
  initialDescription?: string;
  initialImage?: string;
  IconComponent?: React.ComponentType<{ className?: string }>;
  onSave?: (data: { title: string; date: string; description: string; image: string }) => void;
}

const TimelineCard = ({
  isEditable = false,
  initialTitle = "",
  initialDate = "",
  initialDescription = "",
  initialImage = "",
  IconComponent = Camera,
  onSave
}: TimelineCardProps) => {
  const [isEditing, setIsEditing] = useState(isEditable && !initialTitle);
  const [title, setTitle] = useState(initialTitle);
  const [date, setDate] = useState(initialDate);
  const [description, setDescription] = useState(initialDescription);
  const [image, setImage] = useState(initialImage);
  const [imagePreview, setImagePreview] = useState(initialImage);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    const savedData = { title, date, description, image };
    
    // Call the onSave callback if provided
    if (onSave) {
      onSave(savedData);
    }
    
    console.log('Saving timeline card:', savedData);
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    setDate(initialDate);
    setDescription(initialDescription);
    setImage(initialImage);
    setImagePreview(initialImage);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // If it's a new card (no initial title) and not editing, show a placeholder
  if (!isEditing && !title && !date && !description && !imagePreview) {
    return (
      <Card className="minimal-card hover:shadow-md transition-all duration-200 border-dashed">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-3 py-8">
            <IconComponent className="text-muted-foreground w-8 h-8" />
            <p className="text-muted-foreground font-light">
              Click edit to add your timeline story
            </p>
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Add Story
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="minimal-card hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <IconComponent className="text-primary w-5 h-5" />
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
                className="text-lg font-medium"
              />
            </div>
            
            <Input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Date or milestone"
              className="text-primary text-sm font-medium"
            />

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Upload Image (optional)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id={`image-upload-${Date.now()}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById(`image-upload-${Date.now()}`)?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Choose Image
                </Button>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImage('');
                      setImagePreview('');
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-w-sm h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell your story..."
              className="text-muted-foreground leading-relaxed font-light min-h-[100px]"
            />

            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <IconComponent className="text-primary w-5 h-5" />
                <h3 className="text-lg font-medium text-foreground">
                  {title || "Untitled Event"}
                </h3>
              </div>
              {isEditable && (
                <Button
                  onClick={handleEdit}
                  variant="ghost"
                  size="sm"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {date && (
              <p className="text-primary text-sm font-medium mb-3">
                {date}
              </p>
            )}

            {imagePreview && (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Timeline moment"
                  className="w-full max-w-sm h-48 object-cover rounded-lg"
                />
              </div>
            )}
            
            {description && (
              <p className="text-muted-foreground leading-relaxed font-light">
                {description}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimelineCard;
