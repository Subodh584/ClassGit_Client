import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { Check, Users, AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const getDeadlineStatus = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const daysLeft = Math.ceil(
    (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft < 0) {
    return { color: "bg-red-100 text-red-700", status: "Overdue" };
  } else if (daysLeft <= 7) {
    return { color: "bg-amber-100 text-amber-700", status: "Due Soon" };
  } else {
    return { color: "bg-green-100 text-green-700", status: "Safe" };
  }
};

const TeamStatusIcon = ({ status }) => {
  switch (status) {
    case "Joined":
      return <Check className="inline mr-1 size-4 text-green-600" />;
    case "Forming Team":
      return <Users className="inline mr-1 size-4 text-amber-600" />;
    case "Not Joined":
      return <AlertCircle className="inline mr-1 size-4 text-red-600" />;
    default:
      return null;
  }
};

const AssignmentDetails = ({
  title,
  description,
  dueDate,
  subject,
  teacherName,
  minTeamMembers,
  maxTeamMembers,
  teamStatus,
  repositoryName,
  repositoryStatus,
  teamMembers,
  reviews,
  completionPercentage,
}) => {
  const navigate = useNavigate();
  const deadlineInfo = getDeadlineStatus(dueDate);

  const totalMarks = reviews.reduce((sum, review) => sum + review.marks, 0);
  const totalMaxMarks = reviews.reduce(
    (sum, review) => sum + review.maxMarks,
    0
  );

  const pieChartData = reviews.map((review) => ({
    name: review.title,
    value: review.marks,
    maxValue: review.maxMarks,
    fill: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  }));

  const barChartData = reviews.map((review) => ({
    name: review.title,
    obtained: review.marks,
    maximum: review.maxMarks,
  }));

  const COLORS = ["#9b87f5", "#7E69AB", "#6E59A5", "#8B5CF6", "#D946EF"];

  const formattedDate = new Date(dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-background p-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => navigate("/student-dashboard")}
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </button>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {subject} • Taught by {teacherName}
          </p>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full ${deadlineInfo.color}`}
        >
          {deadlineInfo.status}: {formattedDate}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <CardDescription>
              Important information about this project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h5 className="text-sm font-medium mb-1">Description</h5>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-1">Team Requirements</h5>
              <p className="text-sm text-muted-foreground">
                {minTeamMembers === maxTeamMembers
                  ? `Exactly ${minTeamMembers} members required`
                  : `${minTeamMembers}-${maxTeamMembers} members required`}
              </p>
            </div>

            <div>
              <h5 className="text-sm font-medium flex items-center mb-1">
                Team Status
                <span className="ml-1">
                  <TeamStatusIcon status={teamStatus} />
                  {teamStatus}
                </span>
              </h5>

              <div className="flex flex-wrap gap-2 mt-2">
                {teamMembers.map((member) => (
                  <HoverCard key={member.id}>
                    <HoverCardTrigger>
                      <Avatar className="h-8 w-8 border border-border">
                        {member.avatar ? (
                          <AvatarImage src={member.avatar} alt={member.name} />
                        ) : (
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-48">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Team Member
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}

                {teamMembers.length < maxTeamMembers && (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
                    +{maxTeamMembers - teamMembers.length}
                  </div>
                )}
              </div>
            </div>

            {repositoryName && (
              <div>
                <h5 className="text-sm font-medium mb-1">Repository</h5>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">
                    {repositoryName}
                  </span>
                  <Badge
                    variant={
                      repositoryStatus === "Connected" ? "default" : "outline"
                    }
                  >
                    {repositoryStatus}
                  </Badge>
                </div>
              </div>
            )}

            <div>
              <h5 className="text-sm font-medium mb-1">Completion</h5>
              <div className="space-y-1">
                <Progress value={completionPercentage} className="h-2" />
                <p className="text-xs text-right text-muted-foreground">
                  {completionPercentage}% Complete
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Marks & Performance</CardTitle>
            <CardDescription>
              {totalMarks}/{totalMaxMarks} marks (
              {Math.round((totalMarks / totalMaxMarks) * 100)}%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chart">Distribution</TabsTrigger>
                <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
              </TabsList>
              <TabsContent value="chart" className="space-y-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [
                          `${value}/${
                            pieChartData.find((d) => d.name === name)?.maxValue
                          }`,
                          name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="breakdown">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="obtained" fill="#9b87f5" name="Obtained" />
                      <Bar dataKey="maximum" fill="#E5DEFF" name="Maximum" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review Details</CardTitle>
          <CardDescription>
            Breakdown of all the reviews for this assignment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="p-4 rounded-lg border border-border"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium">{review.title}</h5>
                  <span className="text-sm font-medium">
                    {review.marks}/{review.maxMarks}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {review.description}
                </p>
                <div className="mt-2">
                  <Progress
                    value={(review.marks / review.maxMarks) * 100}
                    className="h-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentDetails;
