class Vote{
    constructor(voteOne, voteTwo, voteThree){
        this.option = voteOne;
        this.option = voteTwo;
        this.option = voteThree;
    }

    createVote(vote){
        this.pendingVotes = [];
        this.pendingVotes.push(vote);
    }
}

module.exports = Vote;