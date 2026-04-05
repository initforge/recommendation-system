# web_demo/data_loader.py
"""Load data cho Streamlit web app."""
import sys
from pathlib import Path

# Add parent dir to path to import from src
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.data_loader import load_movielens
