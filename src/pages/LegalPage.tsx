import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-spinner';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/config/firebase';

interface LegalContent {
  title: string;
  content: string;
  lastUpdated: string;
}

export function LegalPage() {
  const { type } = useParams<{ type: string }>();
  const [content, setContent] = useState<LegalContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const getLegalContentCallable = httpsCallable(functions, 'getLegalContent');
        const result = await getLegalContentCallable({ docId: type });
        const fetchedContent = result.data as LegalContent;
        
        if (fetchedContent) {
          setContent(fetchedContent);
        } else {
          setContent(null); // Document not found
        }
      } catch (error) {
        console.error("Error fetching legal content:", error);
        setContent(null); // Handle error case
      }
      setLoading(false);
    };

    if (type) {
      loadContent();
    }
  }, [type]);

  if (loading) {
    return <LoadingState>Loading legal document...</LoadingState>;
  }

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card>
          <CardContent className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
            <p className="text-muted-foreground">
              The requested legal document could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{content.title}</CardTitle>
          <p className="text-muted-foreground">
            Last updated: {new Date(content.lastUpdated).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <div 
            className="space-y-6"
            dangerouslySetInnerHTML={{ 
              __html: content.content
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}