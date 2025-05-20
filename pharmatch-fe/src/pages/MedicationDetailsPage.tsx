import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import useStore from '../store';
const MedicationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { medications } = useStore();
  
  const medication = medications.find(m => m.id === id);
  
  if (!medication) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Medication Not Found</h1>
        <Link to="/medications">
          <Button variant="outline">Back to Medications</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/medications" className="inline-flex items-center text-cyan-600 hover:text-cyan-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Medications
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{medication.name}</CardTitle>
                <Badge variant={medication.prescription ? 'warning' : 'success'}>
                  {medication.prescription ? 'Prescription Required' : 'Over the Counter'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-700">{medication.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                <Badge variant="secondary">{medication.category}</Badge>
              </div>
              
              {medication.prescription && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Prescription Required</h4>
                      <p className="text-sm text-amber-700">
                        This medication requires a valid prescription from a licensed healthcare provider.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Availability */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Pharmacy Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medication.pharmacies.map(pharmacy => (
                  <div key={pharmacy.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-start space-x-3">
                      {pharmacy.inStock ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div>
                        <h3 className="font-medium">{pharmacy.name}</h3>
                        <Badge 
                          variant={pharmacy.inStock ? 'success' : 'danger'}
                          className="mt-1"
                        >
                          {pharmacy.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>
                    {pharmacy.inStock && pharmacy.price && (
                      <div className="text-right">
                        <span className="text-lg font-medium">${pharmacy.price.toFixed(2)}</span>
                        <Link 
                          to={`/pharmacies/${pharmacy.id}`}
                          className="block text-sm text-cyan-600 hover:text-cyan-700 mt-1"
                        >
                          View Pharmacy
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Side Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm">
              <p>
                The information provided here is for reference only. Always consult with a healthcare provider or pharmacist for:
              </p>
              <ul className="list-disc pl-4 space-y-2">
                <li>Proper dosage and administration</li>
                <li>Potential side effects</li>
                <li>Drug interactions</li>
                <li>Contraindications</li>
              </ul>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  If you experience any adverse effects, contact your healthcare provider immediately or seek emergency medical attention if severe.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetailsPage;