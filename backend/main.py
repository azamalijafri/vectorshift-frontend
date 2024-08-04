from collections import deque
from fastapi import FastAPI, Request
import logging
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.DEBUG, filename='app.log', filemode='a', format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def has_cycle(graph):
    indegree = {node: 0 for node in graph} 
    
    for node in graph:
        for neighbor in graph[node]:
            indegree[neighbor] += 1
    
    queue = deque(node for node in graph if indegree[node] == 0)
    
    count = 0  

    while queue:
        node = queue.popleft()
        count += 1

        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return count != len(graph)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
async def parse_pipeline(request: Request):
    data = await request.json()
    
    edges = data.get('edges', [])
    nodes = data.get('nodes', [])
    
    graph = {}
    for node in nodes:
        graph[node] = []
    for edge in edges:
        graph[edge['src']].append(edge['target'])

    cycle_exists = has_cycle(graph)
    
    return {'num_nodes': len(nodes), 'num_edges': len(edges),'is_dag': cycle_exists}
