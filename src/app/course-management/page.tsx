"use client";

import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { YDCOURSE_CONTRACT } from "@/abi/contractConfig";
import { useEffect, useMemo, useState, useCallback } from "react";
import { type Abi } from "viem";
import { Loader2, BookOpen, Users, Award, TrendingUp, Sparkles } from "lucide-react";
import AddCourse from "@/components/cm/CourseFormData";
import EditCourse from "@/components/cm/EditCourse";

interface Course {
  name: string;
  price: bigint;
  isActive: boolean;
  description: string;
}

interface CourseWithId extends Course {
  id: number;
}

export default function CourseManagement() {
  const { isConnected } = useAccount();
  // 添加交易处理状态
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  // 读取课程总数
  const {
    data: courseCount,
    isError: isCountError,
    isLoading: isCountLoading,
    refetch: refetchCourseCount, // 添加 refetch 方法
  } = useReadContract({
    address: YDCOURSE_CONTRACT.address as `0x${string}`,
    abi: YDCOURSE_CONTRACT.abi as Abi,
    functionName: "courseCount",
  });

  // 构建课程请求
  const courseRequests = useMemo(() => {
    if (!courseCount) return [];
    console.log("Building course requests for count:", courseCount);
    return Array.from({ length: Number(courseCount) }, (_, i) => ({
      address: YDCOURSE_CONTRACT.address as `0x${string}`,
      abi: YDCOURSE_CONTRACT.abi as Abi,
      functionName: "getCourse",
      args: [BigInt(i + 1)],
    }));
  }, [courseCount]);

  // 读取所有课程
  const {
    data: coursesData,
    isLoading: isCoursesLoading,
    isError: isCoursesError,
    refetch: refetchCourses, // 添加 refetch 方法
  } = useReadContracts({
    contracts: courseRequests,
  });
  // 刷新课程列表的回调函数
  const refreshCourses = useCallback(async () => {
    console.log("Refreshing courses...");
    try {
      // 先刷新课程总数
      await refetchCourseCount();
      // 然后刷新课程列表
      await refetchCourses();
      console.log("Courses refreshed successfully");
    } catch (error) {
      console.error("Error refreshing courses:", error);
    }
  }, [refetchCourseCount, refetchCourses]);
  // 处理课程数据
  const courses = useMemo(() => {
    if (!coursesData || !courseCount) {
      console.log("No courses data or count");
      return [];
    }

    return coursesData
      .map((result, index) => {
        if (!result?.result) {
          console.log(`No result for course ${index + 1}`);
          return null;
        }

        const courseData = result.result as Course;
        console.log(`Course ${index + 1} data:`, courseData);

        return {
          id: index + 1,
          ...courseData,
        };
      })
      .filter((course): course is CourseWithId => course !== null);
  }, [coursesData, courseCount]);

  // 统计数据
  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const activeCourses = courses.filter(c => c.isActive).length;
    const inactiveCourses = totalCourses - activeCourses;
    const totalValue = courses.reduce((sum, course) => sum + Number(course.price), 0);
    
    return { totalCourses, activeCourses, inactiveCourses, totalValue };
  }, [courses]);

  // 调试日志
  useEffect(() => {
    console.log("Contract Address:", YDCOURSE_CONTRACT.address);
    console.log("Contract ABI:", YDCOURSE_CONTRACT.abi);
  }, []);

  useEffect(() => {
    console.log("Course Count Raw:", courseCount);
    console.log("Course Count Number:", courseCount ? Number(courseCount) : 0);
  }, [courseCount]);

  useEffect(() => {
    console.log("Course Requests:", courseRequests);
  }, [courseRequests]);

  useEffect(() => {
    console.log("Courses Raw Data:", coursesData);
  }, [coursesData]);

  // 检查连接状态
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">钱包未连接</h2>
          <p className="text-red-400">请先连接钱包以访问课程管理</p>
        </div>
      </div>
    );
  }

  // 检查错误状态
  if (isCountError || isCoursesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">加载失败</h2>
          <p className="text-red-400">请检查网络连接后刷新页面</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    课程管理中心
                  </h1>
                </div>
                <p className="text-gray-400 text-lg">
                  管理您的在线课程内容与设置
                </p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <AddCourse
                  onRefreshCourses={refreshCourses}
                  onTransactionStatusChange={setIsTransactionPending}
                />
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/80 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">总课程数</p>
                  <p className="text-2xl font-bold text-white">
                    {courseCount ? Number(courseCount).toString() : "0"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/80 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">已激活</p>
                  <p className="text-2xl font-bold text-white">{stats.activeCourses}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/80 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">未激活</p>
                  <p className="text-2xl font-bold text-white">{stats.inactiveCourses}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/80 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">总价值</p>
                  <p className="text-2xl font-bold text-white">{stats.totalValue} YD</p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Content */}
          {(isCountLoading || isCoursesLoading) && !courses.length ? (
            <div className="flex flex-col items-center justify-center py-16 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
              <div className="w-16 h-16 mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-400 w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">加载课程数据</h3>
              <p className="text-gray-400">正在从区块链获取课程信息...</p>
            </div>
          ) : courses.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">课程列表</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                  <div 
                    key={course.id} 
                    className="group bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/80 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          {course.id}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
                            {course.name}
                          </h3>
                        </div>
                      </div>
                      <EditCourse course={course} onRefreshCourses={refreshCourses} />
                    </div>
                    
                    <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-blue-400 text-xs font-bold">YD</span>
                        </div>
                        <span className="text-xl font-bold text-blue-400">
                          {course.price.toString()}
                        </span>
                      </div>
                      
                      <div className={`
                        px-3 py-1 rounded-full text-sm font-medium border transition-all duration-200
                        ${course.isActive 
                          ? "bg-green-500/20 text-green-300 border-green-500/30 shadow-green-500/20 shadow-sm" 
                          : "bg-red-500/20 text-red-300 border-red-500/30 shadow-red-500/20 shadow-sm"
                        }
                      `}>
                        {course.isActive ? "✨ 已激活" : "⏸ 未激活"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">暂无课程</h3>
              <p className="text-gray-400 mb-6">开始创建您的第一门课程</p>
            </div>
          )}

          {/* Loading Overlay */}
          {(isTransactionPending || (isCoursesLoading && courses.length > 0)) && (
            <div className="fixed bottom-6 right-6 z-50">
              <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-600 shadow-2xl rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Loader2 className="animate-spin text-blue-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {isTransactionPending ? "处理交易中" : "更新数据中"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {isTransactionPending ? "请在钱包中确认..." : "正在同步最新信息..."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const runtime = "edge";