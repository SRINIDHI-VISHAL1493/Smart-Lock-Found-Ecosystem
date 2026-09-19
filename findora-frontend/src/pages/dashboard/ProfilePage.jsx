// src/pages/dashboard/ProfilePage.jsx
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { User, Mail, Award, Calendar } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Your account information</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl text-white font-bold">
              {user?.displayName?.[0] || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.displayName}</h2>
              <Badge variant="primary" className="mt-1 capitalize">
                {user?.role?.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Reward Points</p>
                <p className="font-medium text-gray-900">{user?.rewardPoints || 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-gray-900">{formatDate(user?.createdAt)}</p>
              </div>
            </div>

            {user?.badges && user.badges.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Badges</p>
                <div className="flex gap-2 flex-wrap">
                  {user.badges.map((badge) => (
                    <Badge key={badge} variant="success">
                      {badge.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
