import re
from typing import List, Dict

class TaskParser:
    @staticmethod
    def parse_weeks(raw_text: str) -> List[Dict[str, str]]:
        """Parse AI-generated text into week-based tasks"""
        pattern = r"(\*{0,3}\s*Week\s+\d+:[\s\S]*?)(?=\n\*{0,3}\s*Week\s+\d+:|$)"
        weeks = re.findall(pattern, raw_text)
        
        if not weeks:
            raise ValueError("Failed to parse tasks into weeks")
        
        parsed_tasks = []
        for week_text in weeks:
            title_line = week_text.split("\n")[0].strip()
            parsed_tasks.append({
                "title": title_line,
                "body": week_text
            })
        
        return parsed_tasks