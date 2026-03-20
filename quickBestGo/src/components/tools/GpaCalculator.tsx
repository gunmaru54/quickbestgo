'use client';

import React, { useState } from 'react';
import { GraduationCap, Plus, X, RefreshCcw } from 'lucide-react';

interface GpaCalculatorProps {
  dict: {
    label_course: string;
    label_grade: string;
    label_credits: string;
    btn_add_course: string;
    btn_calculate: string;
    btn_reset: string;
    result_gpa: string;
    result_total_credits: string;
    result_total_points: string;
    placeholder_course: string;
    error_no_courses: string;
    error_invalid_credits: string;
  };
}

interface Course {
  id: number;
  name: string;
  grade: string;
  credits: string;
}

interface Result {
  gpa: number;
  totalCredits: number;
  totalPoints: number;
}

const GRADES = [
  { label: 'A+', value: '4.0' },
  { label: 'A',  value: '4.0' },
  { label: 'A-', value: '3.7' },
  { label: 'B+', value: '3.3' },
  { label: 'B',  value: '3.0' },
  { label: 'B-', value: '2.7' },
  { label: 'C+', value: '2.3' },
  { label: 'C',  value: '2.0' },
  { label: 'C-', value: '1.7' },
  { label: 'D+', value: '1.3' },
  { label: 'D',  value: '1.0' },
  { label: 'D-', value: '0.7' },
  { label: 'F',  value: '0.0' },
];

const getLetterGrade = (gpa: number): string => {
  if (gpa >= 3.85) return 'A';
  if (gpa >= 3.5)  return 'A-';
  if (gpa >= 3.15) return 'B+';
  if (gpa >= 2.85) return 'B';
  if (gpa >= 2.5)  return 'B-';
  if (gpa >= 2.15) return 'C+';
  if (gpa >= 1.85) return 'C';
  if (gpa >= 1.5)  return 'C-';
  if (gpa >= 1.15) return 'D+';
  if (gpa >= 0.85) return 'D';
  if (gpa >= 0.5)  return 'D-';
  return 'F';
};

let nextId = 4;

const createCourse = (id: number): Course => ({ id, name: '', grade: '4.0', credits: '3' });

const GpaCalculator = ({ dict }: GpaCalculatorProps) => {
  const [courses, setCourses] = useState<Course[]>([
    createCourse(1),
    createCourse(2),
    createCourse(3),
  ]);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  const addCourse = () => {
    setCourses((prev) => [...prev, createCourse(nextId++)]);
  };

  const removeCourse = (id: number) => {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setResult(null);
  };

  const updateCourse = (id: number, field: keyof Course, value: string) => {
    setCourses((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c));
    setResult(null);
    setError('');
  };

  const calculate = () => {
    if (courses.length === 0) {
      setError(dict.error_no_courses);
      return;
    }

    let totalPoints = 0;
    let totalCredits = 0;

    for (const course of courses) {
      const credits = parseFloat(course.credits);
      const grade = parseFloat(course.grade);
      if (isNaN(credits) || credits <= 0) {
        setError(dict.error_invalid_credits);
        return;
      }
      totalPoints += grade * credits;
      totalCredits += credits;
    }

    setError('');
    setResult({
      gpa: totalPoints / totalCredits,
      totalCredits,
      totalPoints,
    });
  };

  const reset = () => {
    setCourses([createCourse(nextId++), createCourse(nextId++), createCourse(nextId++)]);
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-[#1a1a1a] rounded-3xl border dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
      <div className="space-y-4">
        {/* Header row */}
        <div className="grid grid-cols-[1fr_80px_70px_32px] gap-2">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{dict.label_course}</span>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{dict.label_grade}</span>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{dict.label_credits}</span>
          <span />
        </div>

        {/* Course rows */}
        <div className="space-y-2">
          {courses.map((course) => (
            <div key={course.id} className="grid grid-cols-[1fr_80px_70px_32px] gap-2 items-center">
              <input
                type="text"
                value={course.name}
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                placeholder={dict.placeholder_course}
                className="px-3 py-2.5 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600"
              />
              <select
                value={course.grade}
                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                className="px-2 py-2.5 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              >
                {GRADES.map((g, i) => (
                  <option key={`${g.label}-${i}`} value={g.value}>{g.label} ({g.value})</option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                step="0.5"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                className="px-2 py-2.5 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 text-sm text-center focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <button
                onClick={() => removeCourse(course.id)}
                disabled={courses.length <= 1}
                className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg"
                title="Remove"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Course */}
        <button
          onClick={addCourse}
          className="w-full py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-xl hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-500 dark:hover:text-blue-400 font-semibold text-sm transition-all flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          {dict.btn_add_course}
        </button>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={calculate}
            className="flex-grow py-4 bg-blue-600 dark:bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-200 dark:shadow-none"
          >
            <GraduationCap size={20} />
            {dict.btn_calculate}
          </button>
          <button
            onClick={reset}
            className="p-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={dict.btn_reset}
          >
            <RefreshCcw size={20} />
          </button>
        </div>

        {result && (
          <div className="space-y-3 animate-in fade-in zoom-in duration-300">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl text-center border border-blue-100 dark:border-blue-900/30">
              <span className="block text-4xl font-black text-blue-600 dark:text-blue-400">
                {result.gpa.toFixed(2)}
              </span>
              <span className="block text-xl font-bold text-blue-400 dark:text-blue-300 mt-1">
                {getLetterGrade(result.gpa)}
              </span>
              <span className="text-sm font-bold text-blue-400 dark:text-blue-300 uppercase tracking-wider">{dict.result_gpa}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-700">
                <span className="block text-2xl font-black text-gray-700 dark:text-gray-200">{result.totalCredits}</span>
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{dict.result_total_credits}</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-700">
                <span className="block text-2xl font-black text-gray-700 dark:text-gray-200">{result.totalPoints.toFixed(1)}</span>
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{dict.result_total_points}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GpaCalculator;
